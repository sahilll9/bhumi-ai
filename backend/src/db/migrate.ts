/**
 * ============================================================================
 * DATABASE MIGRATION SCRIPT
 * ============================================================================
 * This script creates all database tables and initializes default data.
 * 
 * Purpose:
 * - Creates tables: users, villages, farmers, schemes
 * - Sets up indexes for faster queries
 * - Inserts default government schemes (PM-KISAN, PMFBY, etc.)
 * 
 * Usage: npx tsx src/db/migrate.ts
 * Run this once after setting up PostgreSQL database
 * ============================================================================
 */

import { readFileSync, readdirSync } from 'fs';  // Read files from filesystem
import { join } from 'path';        // Join file paths
import { pool } from './connection'; // Database connection pool

/**
 * Main migration function
 * 
 * Steps:
 * 1. Read SQL schema file
 * 2. Execute SQL to create tables
 * 3. Initialize default government schemes
 */
async function migrate() {
  try {
    // Step 1: Read SQL schema file (contains CREATE TABLE statements)
    // This creates all tables: users, villages, farmers, schemes
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    // Step 2: Execute SQL schema to create tables
    await pool.query(schema);
    console.log('✅ Database schema created successfully');

    // Step 3: Insert default government schemes
    // This populates the schemes table with PM-KISAN, PMFBY, etc.
    await initializeSchemes();
    console.log('✅ Default schemes initialized');

    // Step 4: Run additional migrations
    console.log('🔄 Checking for additional migrations...');
    const migrationsDir = join(__dirname, 'migrations');

    try {
      const migrationFiles = readdirSync(migrationsDir).sort();
      for (const file of migrationFiles) {
        if (file.endsWith('.sql')) {
          console.log(`   Running migration: ${file}`);
          const migrationSql = readFileSync(join(migrationsDir, file), 'utf-8');
          await pool.query(migrationSql);
        }
      }
      console.log('✅ Additional migrations executed successfully');
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        console.log('   No migrations directory found.');
      } else {
        throw err;
      }
    }

    console.log('🎉 Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration error LOG:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    console.error('Make sure PostgreSQL is running and DATABASE_URL is correct in .env');
    process.exit(1);
  }
}

// Initialize government schemes
async function initializeSchemes() {
  const schemes = [
    {
      name: 'PM-KISAN',
      code: 'PMKISAN',
      description: 'Pradhan Mantri Kisan Samman Nidhi - Direct income support to farmers',
      category: 'Agriculture',
      eligibility_criteria: { land_size_max: 2.0, income_category: ['Below Poverty Line', 'Low'], required: ['aadhaar'] },
      benefits: '₹6,000 per year in three installments',
      application_link: 'https://pmkisan.gov.in'
    },
    {
      name: 'PMFBY - Crop Insurance',
      code: 'PMFBY',
      description: 'Pradhan Mantri Fasal Bima Yojana - Crop insurance scheme',
      category: 'Agriculture',
      eligibility_criteria: { crop_type: ['any'], land_size_min: 0.1 },
      benefits: 'Crop insurance coverage with low premium',
      application_link: 'https://pmfby.gov.in'
    },
    {
      name: 'Soil Health Card',
      code: 'SHC',
      description: 'Free soil health card for farmers',
      category: 'Agriculture',
      eligibility_criteria: { land_size_min: 0.1 },
      benefits: 'Free soil testing and recommendations',
      application_link: 'https://soilhealth.dac.gov.in'
    },
    {
      name: 'MGNREGA',
      code: 'MGNREGA',
      description: 'Mahatma Gandhi National Rural Employment Guarantee Act',
      category: 'Infrastructure',
      eligibility_criteria: { income_category: ['Below Poverty Line', 'Low'], rural: true },
      benefits: '100 days of guaranteed employment',
      application_link: 'https://nrega.nic.in'
    },
    {
      name: 'Irrigation & Water Schemes',
      code: 'IRRIGATION',
      description: 'Various irrigation and water management schemes',
      category: 'Irrigation',
      eligibility_criteria: { irrigation_access: false, land_size_min: 0.5 },
      benefits: 'Subsidy for irrigation equipment and water management',
      application_link: 'https://pmksy.gov.in'
    },
    {
      name: 'Rural Infrastructure',
      code: 'RURAL_INFRA',
      description: 'Rural connectivity and infrastructure development',
      category: 'Infrastructure',
      eligibility_criteria: { connectivity_risk: 0.6 },
      benefits: 'Road connectivity, electricity, and basic infrastructure',
      application_link: 'https://pmgsy.nic.in'
    }
  ];

  for (const scheme of schemes) {
    const checkQuery = 'SELECT id FROM schemes WHERE code = $1';
    const exists = await pool.query(checkQuery, [scheme.code]);

    if (exists.rows.length === 0) {
      const insertQuery = `
        INSERT INTO schemes (name, code, description, category, eligibility_criteria, benefits, application_link)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      await pool.query(insertQuery, [
        scheme.name,
        scheme.code,
        scheme.description,
        scheme.category,
        JSON.stringify(scheme.eligibility_criteria),
        scheme.benefits,
        scheme.application_link
      ]);
    }
  }
}

if (require.main === module) {
  migrate().then(() => process.exit(0));
}

export default migrate;
