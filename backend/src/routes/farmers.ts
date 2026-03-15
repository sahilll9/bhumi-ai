import express, { Request, Response } from 'express';
import { pool } from '../db/connection';
import { authenticateToken } from '../middleware/auth';
import { calculateEligibilityScore } from '../utils/schemeMatcher';

const router = express.Router();

// Get all farmers (with optional village filter)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { village_id, limit = 100, offset = 0 } = req.query;

    let query = 'SELECT * FROM farmers WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (village_id) {
      query += ` AND village_id = $${paramCount++}`;
      params.push(village_id);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching farmers:', error);
    res.status(500).json({ error: 'Failed to fetch farmers' });
  }
});

// Get single farmer by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM farmers WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching farmer:', error);
    res.status(500).json({ error: 'Failed to fetch farmer' });
  }
});

// Create new farmer
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const farmerData = req.body;

    // Validate required fields
    if (!farmerData.name || !farmerData.village_id) {
      return res.status(400).json({ error: 'Name and village_id are required' });
    }

    const result = await pool.query(
      `INSERT INTO farmers (
        village_id, name, phone, aadhaar,
        land_size_hectares, crop_type, irrigation_access,
        soil_condition, income_category, season,
        latitude, longitude
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        farmerData.village_id,
        farmerData.name,
        farmerData.phone || null,
        farmerData.aadhaar || null,
        farmerData.land_size_hectares || 0,
        farmerData.crop_type || '',
        farmerData.irrigation_access || false,
        farmerData.soil_condition || '',
        farmerData.income_category || '',
        farmerData.season || '',
        farmerData.latitude || null,
        farmerData.longitude || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating farmer:', error);
    res.status(500).json({ error: 'Failed to create farmer' });
  }
});

// Match schemes based on profile data (Questionnaire)
router.post('/match-schemes', async (req: Request, res: Response) => {
  try {
    const profile = req.body;

    // Get all active schemes
    const schemesResult = await pool.query('SELECT * FROM schemes WHERE is_active = true');
    const allSchemes = schemesResult.rows;

    const recommendations = [];

    for (const scheme of allSchemes) {
      const criteria = scheme.eligibility_criteria;
      const matchResult = calculateEligibilityScore(
        {
          land_size_hectares: parseFloat(profile.land_size_hectares) || 0,
          crop_type: profile.crop_type || '',
          irrigation_access: profile.irrigation_access === 'true' || profile.irrigation_access === true,
          income_category: profile.income_category || ''
        },
        criteria
      );

      if (matchResult.score > 0.2) {
        recommendations.push({
          scheme: {
            id: scheme.id,
            name: scheme.name,
            code: scheme.code,
            description: scheme.description,
            category: scheme.category,
            benefits: scheme.benefits,
            application_link: scheme.application_link
          },
          eligibility_score: matchResult.score,
          confidence: matchResult.score,
          reason: matchResult.reasons.join('; ') || 'Based on your profile responses',
          match_criteria: matchResult.matchCriteria
        });
      }
    }

    recommendations.sort((a, b) => b.eligibility_score - a.eligibility_score);
    res.json(recommendations);
  } catch (error) {
    console.error('Error matching schemes:', error);
    res.status(500).json({ error: 'Failed to match schemes' });
  }
});

// Get recommended schemes for a farmer
router.get('/:id/schemes', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get farmer data
    const farmerResult = await pool.query('SELECT * FROM farmers WHERE id = $1', [id]);
    if (farmerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    const farmer = farmerResult.rows[0];

    // Get village indicators if available
    let villageIndicators: { agri_dependency_index: number; irrigation_stress_index: number; connectivity_risk_score: number } | undefined = undefined;
    if (farmer.village_id) {
      const villageResult = await pool.query('SELECT * FROM villages WHERE id = $1', [farmer.village_id]);
      if (villageResult.rows.length > 0) {
        const v = villageResult.rows[0];
        villageIndicators = {
          agri_dependency_index: parseFloat(v.agri_dependency_index) || 0,
          irrigation_stress_index: parseFloat(v.irrigation_stress_index) || 0,
          connectivity_risk_score: parseFloat(v.connectivity_risk_score) || 0
        };
      }
    }

    // Get all active schemes
    const schemesResult = await pool.query('SELECT * FROM schemes WHERE is_active = true');
    const allSchemes = schemesResult.rows;

    // Match schemes
    const recommendations = [];

    for (const scheme of allSchemes) {
      const criteria = scheme.eligibility_criteria;
      const matchResult = calculateEligibilityScore(
        {
          land_size_hectares: parseFloat(farmer.land_size_hectares) || 0,
          crop_type: farmer.crop_type || '',
          irrigation_access: farmer.irrigation_access || false,
          income_category: farmer.income_category || ''
        },
        criteria,
        villageIndicators
      );

      // Only include if score > 0.3
      if (matchResult.score > 0.3) {
        recommendations.push({
          scheme: {
            id: scheme.id,
            name: scheme.name,
            code: scheme.code,
            description: scheme.description,
            category: scheme.category,
            benefits: scheme.benefits,
            application_link: scheme.application_link
          },
          eligibility_score: matchResult.score,
          confidence: matchResult.score,
          reason: matchResult.reasons.join('; ') || 'Based on farmer profile',
          match_criteria: matchResult.matchCriteria
        });
      }
    }

    // Sort by eligibility score
    recommendations.sort((a, b) => b.eligibility_score - a.eligibility_score);

    res.json(recommendations);
  } catch (error: any) {
    console.error('Error fetching farmer schemes:', error);
    res.status(500).json({ error: 'Failed to fetch schemes' });
  }
});

// Update land details & request verification
router.post('/:id/land-details', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id: paramId } = req.params;
    const { khasra_number, latitude, longitude, image_url } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // 1. Get or Create Farmer record for this user
    let farmerId: number;
    const farmerCheck = await pool.query('SELECT id FROM farmers WHERE user_id = $1', [userId]);

    if (farmerCheck.rows.length > 0) {
      farmerId = farmerCheck.rows[0].id;
      // Update existing farmer with new data
      await pool.query(
        'UPDATE farmers SET khasra_number = $1, latitude = $2, longitude = $3 WHERE id = $4',
        [khasra_number, latitude || null, longitude || null, farmerId]
      );
    } else {
      // Create a farmer record for this user
      const userResult = await pool.query('SELECT full_name, username FROM users WHERE id = $1', [userId]);
      const user = userResult.rows[0];
      const name = user?.full_name || user?.username || 'Unknown Farmer';

      const newFarmer = await pool.query(
        'INSERT INTO farmers (user_id, name, khasra_number, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [userId, name, khasra_number, latitude || null, longitude || null]
      );
      farmerId = newFarmer.rows[0].id;
    }

    // 2. Create verification record (Linked to specific plot/Khasra)
    // Mock AI Confidence (random between 0.7 and 0.99)
    const mockConfidence = (Math.random() * (0.99 - 0.7) + 0.7).toFixed(2);

    // Auto-verify if confidence is high, else pending
    const status = parseFloat(mockConfidence) > 0.85 ? 'verified' : 'pending';
    const notes = status === 'verified' ? 'Auto-verified by Bhumi AI' : 'Manual review required';

    const verificationResult = await pool.query(
      `INSERT INTO land_verifications (farmer_id, image_url, status, ai_confidence, notes, khasra_number, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [farmerId, image_url || '', status, mockConfidence, notes, khasra_number, latitude, longitude]
    );

    // 3. Update farmer status if auto-verified (just to show activity)
    if (status === 'verified') {
      await pool.query("UPDATE farmers SET verification_status = 'verified' WHERE id = $1", [farmerId]);
    }

    res.json({
      success: true,
      message: 'Land details saved and linked to your profile',
      verification: verificationResult.rows[0],
      is_verified: status === 'verified',
      farmer_id: farmerId
    });

  } catch (error: any) {
    console.error('CRITICAL ERROR during land registration:', error.message);
    console.error('Request body:', req.body);
    res.status(500).json({
      error: 'Failed to update land details',
      details: error.message,
      hint: 'Ensure your account session is valid.'
    });
  }
});

// Get verifications for a farmer
router.get('/:id/verifications', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM land_verifications WHERE farmer_id = $1 ORDER BY created_at DESC', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching verifications:', error);
    res.status(500).json({ error: 'Failed to fetch verifications' });
  }
});

export default router;
