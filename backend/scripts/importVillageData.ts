/**
 * Script to import village data from CSV
 * Usage: tsx scripts/importVillageData.ts <csv_file_path>
 */
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { pool } from '../src/db/connection';

// Note: Install csv-parse: npm install csv-parse
import { calculateIndicators, calculatePriorityScore, calculateConfidenceScore, detectAnomaly } from '../src/utils/aiCalculations';

interface VillageRow {
  'State Name': string;
  'District Name': string;
  'Sub District Name': string;
  'Village Name': string;
  'Total Geographical Area (in Hectares)': string;
  'Net Area Sown (in Hectares)': string;
  'Total Unirrigated Land Area (in Hectares)': string;
  'Area Irrigated by Source (in Hectares)': string;
  'Nearest Town Distance from Village (in Km.)': string;
}

async function importVillageData(csvPath: string) {
  try {
    // Read and parse CSV
    const fileContent = readFileSync(csvPath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }) as VillageRow[];

    console.log(`Found ${records.length} villages to import`);

    let imported = 0;
    let skipped = 0;

    for (const row of records) {
      try {
        // Check if village already exists
        const exists = await pool.query(
          'SELECT id FROM villages WHERE village_name = $1 AND district_name = $2',
          [row['Village Name'], row['District Name']]
        );

        if (exists.rows.length > 0) {
          skipped++;
          continue;
        }

        // Parse numeric values
        const totalArea = parseFloat(row['Total Geographical Area (in Hectares)']) || 0;
        const netAreaSown = parseFloat(row['Net Area Sown (in Hectares)']) || 0;
        const unirrigatedArea = parseFloat(row['Total Unirrigated Land Area (in Hectares)']) || 0;
        const irrigatedArea = parseFloat(row['Area Irrigated by Source (in Hectares)']) || 0;
        const distanceToTown = parseFloat(row['Nearest Town Distance from Village (in Km.)']) || 0;

        // Calculate AI indicators
        const indicators = calculateIndicators({
          total_area: totalArea,
          net_area_sown: netAreaSown,
          unirrigated_area: unirrigatedArea,
          distance_to_town_km: distanceToTown
        });

        // Calculate priority
        const priority = calculatePriorityScore(indicators);

        // Calculate confidence
        const confidence = calculateConfidenceScore(indicators);

        // Insert village
        const result = await pool.query(
          `INSERT INTO villages (
            state_name, district_name, sub_district_name, village_name,
            total_area, net_area_sown, unirrigated_area, irrigated_area, distance_to_town_km,
            agri_dependency_index, irrigation_stress_index, connectivity_risk_score,
            priority_score, priority_level, confidence_score
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          RETURNING id`,
          [
            row['State Name'],
            row['District Name'],
            row['Sub District Name'] || '',
            row['Village Name'],
            totalArea,
            netAreaSown,
            unirrigatedArea,
            irrigatedArea,
            distanceToTown,
            indicators.agri_dependency,
            indicators.irrigation_stress,
            indicators.connectivity_risk,
            priority.score,
            priority.level,
            confidence
          ]
        );

        const villageId = result.rows[0].id;

        // Detect anomalies
        const anomaly = await detectAnomaly(villageId, priority.score, pool);
        await pool.query(
          'UPDATE villages SET anomaly_flag = $1, anomaly_reason = $2 WHERE id = $3',
          [anomaly.flag, anomaly.reason, villageId]
        );

        imported++;

        if (imported % 100 === 0) {
          console.log(`Imported ${imported} villages...`);
        }
      } catch (error: any) {
        console.error(`Error importing village ${row['Village Name']}:`, error.message);
      }
    }

    console.log(`\nImport complete!`);
    console.log(`Imported: ${imported}`);
    console.log(`Skipped: ${skipped}`);
  } catch (error: any) {
    console.error('Import error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error('Usage: tsx scripts/importVillageData.ts <csv_file_path>');
    process.exit(1);
  }
  importVillageData(csvPath);
}

export default importVillageData;
