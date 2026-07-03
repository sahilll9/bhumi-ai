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
    const { message, language = 'en', farmer_id, village_id, mode = 'online', model, apiKey } = req.body;

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

    // Call Python AI service or use offline engine based on mode
    try {
      if (mode === 'offline') {
        throw new Error('Offline mode requested by user'); // Trigger fallback block
      }
      
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/chat`, {
        message,
        language,
        context,
        model,
        apiKey
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

// Fallback rule-based responses (Enhanced Offline Engine)
function getFallbackResponse(message: string, language: string): string {
  const msgLower = message.toLowerCase();

  if (language === 'hi') {
    if (msgLower.includes('pm-kisan') || msgLower.includes('kisan') || msgLower.includes('6000') || msgLower.includes('pm kisan')) {
      return 'PM-KISAN योजना के तहत छोटे और सीमांत किसानों को ₹6,000 प्रति वर्ष 3 किस्तों में मिलते हैं। इसके लिए आपका बैंक खाता आधार से लिंक होना चाहिए।';
    }
    if (msgLower.includes('insurance') || msgLower.includes('bima') || msgLower.includes('बीमा') || msgLower.includes('pmfby')) {
      return 'PMFBY (प्रधानमंत्री फसल बीमा योजना) प्राकृतिक आपदाओं, कीटों और बीमारियों के कारण फसल के नुकसान पर वित्तीय सहायता प्रदान करती है। खरीफ के लिए 2% और रबी के लिए 1.5% प्रीमियम है।';
    }
    if (msgLower.includes('mgnrega') || msgLower.includes('रोजगार') || msgLower.includes('मनरेगा')) {
      return 'MGNREGA ग्रामीण क्षेत्रों में 100 दिनों के रोजगार की गारंटी देता है। यह अकुशल शारीरिक कार्य के लिए न्यूनतम मजदूरी सुनिश्चित करता है।';
    }
    if (msgLower.includes('soil') || msgLower.includes('मिट्टी') || msgLower.includes('मृदा')) {
      return 'मृदा स्वास्थ्य कार्ड (Soil Health Card) योजना किसानों को उनकी मिट्टी की स्थिति और आवश्यक उर्वरकों के बारे में जानकारी देती है, जिससे उपज बढ़ती है।';
    }
    if (msgLower.includes('loan') || msgLower.includes('kcc') || msgLower.includes('कर्ज') || msgLower.includes('ऋण')) {
      return 'किसान क्रेडिट कार्ड (KCC) योजना किसानों को खेती के खर्चों के लिए कम ब्याज दर पर संस्थागत ऋण प्रदान करती है।';
    }
    if (msgLower.includes('subsidy') || msgLower.includes('सब्सिडी') || msgLower.includes('tractor') || msgLower.includes('मशीन')) {
      return 'विभिन्न राज्य और केंद्र सरकारें कृषि मशीनरी (जैसे ट्रैक्टर, रोटावेटर) पर 20% से 50% तक की सब्सिडी (SMAM योजना) प्रदान करती हैं।';
    }
    if (msgLower.includes('irrigation') || msgLower.includes('सिंचाई') || msgLower.includes('pmksy')) {
      return 'PMKSY (प्रधानमंत्री कृषि सिंचाई योजना) का उद्देश्य खेत में पानी की पहुंच में सुधार करना और पानी के उपयोग की दक्षता बढ़ाना है (प्रति बूंद अधिक फसल)।';
    }
    return 'मैं आपकी मदद कर सकता हूं। कृपया PM-KISAN, PMFBY, KCC, सब्सिडी, मिट्टी स्वास्थ्य या सिंचाई योजनाओं के बारे में पूछें। (ऑफ़लाइन मोड सक्रिय)';
  }

  // English fallback
  if (msgLower.includes('pm-kisan') || msgLower.includes('kisan') || msgLower.includes('6000') || msgLower.includes('pm kisan')) {
    return 'PM-KISAN provides direct income support of ₹6,000 per year in 3 equal installments to eligible farmers. Ensure your bank account is Aadhaar-seeded.';
  }
  if (msgLower.includes('insurance') || msgLower.includes('bima') || msgLower.includes('pmfby') || msgLower.includes('crop loss')) {
    return 'PMFBY (Pradhan Mantri Fasal Bima Yojana) provides financial support for crop loss due to natural calamities, pests, and diseases. Premium is 2% for Kharif and 1.5% for Rabi.';
  }
  if (msgLower.includes('mgnrega') || msgLower.includes('employment')) {
    return 'MGNREGA provides 100 days of guaranteed wage employment in rural areas for unskilled manual work.';
  }
  if (msgLower.includes('soil') || msgLower.includes('fertilizer') || msgLower.includes('health card')) {
    return 'The Soil Health Card Scheme provides information on your soil nutrient status and recommendations on appropriate dosage of nutrients/fertilizers.';
  }
  if (msgLower.includes('loan') || msgLower.includes('kcc') || msgLower.includes('credit')) {
    return 'Kisan Credit Card (KCC) scheme provides farmers with timely access to adequate institutional credit for agricultural expenses at low interest rates.';
  }
  if (msgLower.includes('subsidy') || msgLower.includes('tractor') || msgLower.includes('machinery') || msgLower.includes('equipment')) {
    return 'Under the Sub-Mission on Agricultural Mechanization (SMAM), governments provide 20% to 50% subsidy for purchasing agricultural machinery like tractors.';
  }
  if (msgLower.includes('irrigation') || msgLower.includes('pmksy') || msgLower.includes('water')) {
    return 'PMKSY (Pradhan Mantri Krishi Sinchayee Yojana) focuses on improving water access on farms and enhancing water use efficiency (More crop per drop).';
  }
  return 'I can help you with government schemes. Please ask about PM-KISAN, PMFBY, KCC, Subsidies, Soil Health, or Irrigation schemes. (Offline mode active)';
}

export default router;
