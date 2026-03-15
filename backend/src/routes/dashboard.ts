import express, { Request, Response } from 'express';
import { pool } from '../db/connection';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // Get counts
    const villagesResult = await pool.query('SELECT COUNT(*) as count FROM villages');
    const farmersResult = await pool.query('SELECT COUNT(*) as count FROM farmers');
    const schemesResult = await pool.query('SELECT COUNT(*) as count FROM schemes WHERE is_active = true');

    const highPriorityResult = await pool.query(
      "SELECT COUNT(*) as count FROM villages WHERE priority_level = 'High'"
    );

    const anomalyResult = await pool.query(
      'SELECT COUNT(*) as count FROM villages WHERE anomaly_flag = true'
    );

    const trustScoreResult = await pool.query(
      'SELECT AVG(trust_score) as avg FROM villages'
    );

    const verificationsResult = await pool.query('SELECT COUNT(*) as count FROM land_verifications');

    res.json({
      total_villages: parseInt(villagesResult.rows[0].count),
      total_farmers: parseInt(farmersResult.rows[0].count),
      total_schemes: parseInt(schemesResult.rows[0].count),
      high_priority_villages: parseInt(highPriorityResult.rows[0].count),
      anomaly_villages: parseInt(anomalyResult.rows[0].count),
      avg_trust_score: parseFloat(trustScoreResult.rows[0].avg) || 0.5,
      total_verifications: parseInt(verificationsResult.rows[0].count)
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router;
