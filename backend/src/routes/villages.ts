import express, { Request, Response } from 'express';
import { pool } from '../db/connection';
import { authenticateToken } from '../middleware/auth';
import { calculateIndicators, calculatePriorityScore, calculateConfidenceScore, detectAnomaly } from '../utils/aiCalculations';
import { recommendSchemesForVillage } from '../utils/schemeMatcher';

const router = express.Router();

// Get all villages (with filters)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { district, state, limit = 100, offset = 0 } = req.query;

    let query = 'SELECT * FROM villages WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (district) {
      query += ` AND district_name = $${paramCount++}`;
      params.push(district);
    }

    if (state) {
      query += ` AND state_name = $${paramCount++}`;
      params.push(state);
    }

    query += ` ORDER BY priority_score DESC NULLS LAST LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await pool.query(query, params);

    // Format response with indicators
    const villages = result.rows.map((v: any) => ({
      id: v.id,
      state_name: v.state_name,
      district_name: v.district_name,
      sub_district_name: v.sub_district_name,
      village_name: v.village_name,
      total_area: parseFloat(v.total_area) || 0,
      net_area_sown: parseFloat(v.net_area_sown) || 0,
      unirrigated_area: parseFloat(v.unirrigated_area) || 0,
      irrigated_area: parseFloat(v.irrigated_area) || 0,
      distance_to_town_km: parseFloat(v.distance_to_town_km) || 0,
      indicators: {
        agri_dependency: parseFloat(v.agri_dependency_index) || 0,
        irrigation_stress: parseFloat(v.irrigation_stress_index) || 0,
        connectivity_risk: parseFloat(v.connectivity_risk_score) || 0
      },
      priority: {
        score: parseFloat(v.priority_score) || 0,
        level: v.priority_level || 'Low'
      },
      confidence_score: parseFloat(v.confidence_score) || 0,
      recommended_schemes: v.recommended_schemes || [],
      anomaly: {
        flag: v.anomaly_flag || false,
        reason: v.anomaly_reason || null
      },
      trust_score: parseFloat(v.trust_score) || 0.5,
      created_at: v.created_at
    }));

    res.json(villages);
  } catch (error: any) {
    console.error('Error fetching villages:', error);
    res.status(500).json({ error: 'Failed to fetch villages' });
  }
});

// Get single village by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM villages WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Village not found' });
    }

    const v = result.rows[0];

    // Get recommended schemes
    const schemes = recommendSchemesForVillage({
      agri_dependency_index: parseFloat(v.agri_dependency_index) || 0,
      irrigation_stress_index: parseFloat(v.irrigation_stress_index) || 0,
      connectivity_risk_score: parseFloat(v.connectivity_risk_score) || 0
    });

    res.json({
      id: v.id,
      state_name: v.state_name,
      district_name: v.district_name,
      sub_district_name: v.sub_district_name,
      village_name: v.village_name,
      indicators: {
        agri_dependency: parseFloat(v.agri_dependency_index) || 0,
        irrigation_stress: parseFloat(v.irrigation_stress_index) || 0,
        connectivity_risk: parseFloat(v.connectivity_risk_score) || 0
      },
      priority: {
        score: parseFloat(v.priority_score) || 0,
        level: v.priority_level || 'Low'
      },
      confidence_score: parseFloat(v.confidence_score) || 0,
      recommended_schemes: schemes,
      anomaly: {
        flag: v.anomaly_flag || false,
        reason: v.anomaly_reason || null
      },
      trust_score: parseFloat(v.trust_score) || 0.5
    });
  } catch (error: any) {
    console.error('Error fetching village:', error);
    res.status(500).json({ error: 'Failed to fetch village' });
  }
});

// Create new village
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const villageData = req.body;

    // Calculate AI indicators
    const indicators = calculateIndicators({
      total_area: villageData.total_area,
      net_area_sown: villageData.net_area_sown,
      unirrigated_area: villageData.unirrigated_area,
      distance_to_town_km: villageData.distance_to_town_km
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
      RETURNING *`,
      [
        villageData.state_name,
        villageData.district_name,
        villageData.sub_district_name,
        villageData.village_name,
        villageData.total_area || 0,
        villageData.net_area_sown || 0,
        villageData.unirrigated_area || 0,
        villageData.irrigated_area || 0,
        villageData.distance_to_town_km || 0,
        indicators.agri_dependency,
        indicators.irrigation_stress,
        indicators.connectivity_risk,
        priority.score,
        priority.level,
        confidence
      ]
    );

    const village = result.rows[0];

    // Detect anomalies
    const anomaly = await detectAnomaly(village.id, priority.score, pool);
    await pool.query(
      'UPDATE villages SET anomaly_flag = $1, anomaly_reason = $2 WHERE id = $3',
      [anomaly.flag, anomaly.reason, village.id]
    );

    // Get recommended schemes
    const schemes = recommendSchemesForVillage({
      agri_dependency_index: indicators.agri_dependency,
      irrigation_stress_index: indicators.irrigation_stress,
      connectivity_risk_score: indicators.connectivity_risk
    });

    res.status(201).json({
      id: village.id,
      village_name: village.village_name,
      indicators,
      priority,
      confidence_score: confidence,
      recommended_schemes: schemes,
      anomaly
    });
  } catch (error: any) {
    console.error('Error creating village:', error);
    res.status(500).json({ error: 'Failed to create village' });
  }
});

// Get recommended schemes for a village
router.get('/:id/schemes', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM villages WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Village not found' });
    }

    const v = result.rows[0];
    const schemes = recommendSchemesForVillage({
      agri_dependency_index: parseFloat(v.agri_dependency_index) || 0,
      irrigation_stress_index: parseFloat(v.irrigation_stress_index) || 0,
      connectivity_risk_score: parseFloat(v.connectivity_risk_score) || 0
    });

    res.json(schemes);
  } catch (error: any) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ error: 'Failed to fetch schemes' });
  }
});

export default router;
