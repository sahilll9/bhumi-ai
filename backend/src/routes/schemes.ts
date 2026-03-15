import express, { Request, Response } from 'express';
import { pool } from '../db/connection';

const router = express.Router();

// Get all active schemes
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM schemes WHERE is_active = true ORDER BY name'
    );
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ error: 'Failed to fetch schemes' });
  }
});

// Get single scheme by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM schemes WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Scheme not found' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching scheme:', error);
    res.status(500).json({ error: 'Failed to fetch scheme' });
  }
});

export default router;
