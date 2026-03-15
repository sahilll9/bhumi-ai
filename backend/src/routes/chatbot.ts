import express, { Request, Response } from 'express';
import axios from 'axios';
import multer from 'multer';
import { pool } from '../db/connection';

const router = express.Router();

// Configure multer for image uploads (in-memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// AI service URL (Python microservice)
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

// Chat endpoint - forwards to Python AI service
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, language = 'en', farmer_id, village_id } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build context from farmer/village data if provided
    let context = '';
    if (farmer_id) {
      const farmerResult = await pool.query('SELECT * FROM farmers WHERE id = $1', [farmer_id]);
      if (farmerResult.rows.length > 0) {
        const farmer = farmerResult.rows[0];
        context += `Farmer: ${farmer.name}, Land: ${farmer.land_size_hectares}ha, Crop: ${farmer.crop_type}, Income: ${farmer.income_category}. `;
      }
    }

    if (village_id) {
      const villageResult = await pool.query('SELECT * FROM villages WHERE id = $1', [village_id]);
      if (villageResult.rows.length > 0) {
        const village = villageResult.rows[0];
        context += `Village: ${village.village_name}, Priority: ${village.priority_level}.`;
      }
    }

    // Call Python AI service
    try {
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/chat`, {
        message,
        language,
        context
      }, {
        timeout: 10000 // 10 second timeout
      });

      // Get suggested schemes if farmer_id provided
      let suggestedSchemes = null;
      if (farmer_id) {
        const schemesResult = await pool.query(
          `SELECT s.name FROM schemes s
           INNER JOIN scheme_applications sa ON s.id = sa.scheme_id
           WHERE sa.farmer_id = $1
           ORDER BY sa.eligibility_score DESC
           LIMIT 3`,
          [farmer_id]
        );
        suggestedSchemes = schemesResult.rows.map((r: any) => r.name);
      }

      res.json({
        response: aiResponse.data.response || aiResponse.data.message,
        language,
        suggested_schemes: suggestedSchemes
      });
    } catch (aiError: any) {
      // Fallback to rule-based response if AI service is down
      console.warn('AI service unavailable, using fallback:', aiError.message);
      const fallbackResponse = getFallbackResponse(message, language);
      res.json({
        response: fallbackResponse,
        language,
        suggested_schemes: null
      });
    }
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat service error' });
  }
});

// Document Verification endpoint
router.post('/verify-document', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const { doc_type = 'government document' } = req.body;

    // Convert buffer to base64
    const base64Image = req.file.buffer.toString('base64');

    // Call Python AI service's verification endpoint
    try {
      console.log('--- Document Verification Request ---');
      console.log('Doc Type:', doc_type);

      const aiResponse = await axios.post(`${AI_SERVICE_URL}/verify-document`, {
        image: base64Image,
        doc_type
      });

      console.log('AI Service raw response:', aiResponse.data);

      // Parse inner JSON if it's a string (Groq might return stringified JSON)
      let verificationData = aiResponse.data;
      if (typeof verificationData === 'string') {
        try {
          verificationData = JSON.parse(verificationData);
        } catch (e) {
          console.error('Failed to parse AI JSON:', e);
        }
      }

      res.json(verificationData);
    } catch (aiError: any) {
      console.error('AI verification service error:', aiError.message);
      res.status(503).json({
        error: 'Verification service temporarily unavailable',
        fraud_likelihood: 'Unknown'
      });
    }
  } catch (error: any) {
    console.error('Verification route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fallback rule-based responses
function getFallbackResponse(message: string, language: string): string {
  const msgLower = message.toLowerCase();

  if (language === 'hi') {
    if (msgLower.includes('pm-kisan') || msgLower.includes('kisan')) {
      return 'PM-KISAN योजना किसानों को प्रत्यक्ष आय सहायता प्रदान करती है। यदि आपके पास 2 हेक्टेयर तक जमीन है और आपकी आय कम है, तो आप इस योजना के लिए पात्र हो सकते हैं। आपको वर्ष में ₹6,000 तीन किस्तों में मिलेंगे।';
    }
    if (msgLower.includes('insurance') || msgLower.includes('bima')) {
      return 'PMFBY (प्रधानमंत्री फसल बीमा योजना) फसल बीमा प्रदान करती है। यह कम प्रीमियम पर फसल नुकसान से सुरक्षा देती है।';
    }
    if (msgLower.includes('mgnrega') || msgLower.includes('रोजगार')) {
      return 'MGNREGA ग्रामीण क्षेत्रों में 100 दिनों की गारंटीशुदा रोजगार प्रदान करती है। यह गरीबी रेखा से नीचे और कम आय वाले परिवारों के लिए है।';
    }
    return 'मैं आपकी मदद कर सकता हूं। कृपया PM-KISAN, PMFBY, MGNREGA, या अन्य योजनाओं के बारे में पूछें।';
  }

  // English fallback
  if (msgLower.includes('pm-kisan') || msgLower.includes('kisan')) {
    return 'PM-KISAN provides direct income support to farmers. If you have up to 2 hectares of land and low income, you may be eligible. You\'ll receive ₹6,000 per year in three installments.';
  }
  if (msgLower.includes('insurance') || msgLower.includes('bima')) {
    return 'PMFBY (Pradhan Mantri Fasal Bima Yojana) provides crop insurance. It offers protection against crop loss at low premium rates.';
  }
  if (msgLower.includes('mgnrega') || msgLower.includes('employment')) {
    return 'MGNREGA provides 100 days of guaranteed employment in rural areas. It\'s for Below Poverty Line and low-income families.';
  }
  return 'I can help you with government schemes. Please ask about PM-KISAN, PMFBY, MGNREGA, or other schemes.';
}

export default router;
