"""
============================================================================
AI SERVICE - MULTILINGUAL CHATBOT MICROSERVICE
============================================================================
This Python Flask service handles AI-powered conversations for farmers.
It can use OpenAI GPT-3.5 API or fallback to rule-based responses.

Features:
- Multilingual support (English, Hindi, and more)
- Explains government schemes (PM-KISAN, PMFBY, MGNREGA, etc.)
- Provides scheme recommendations
- Answers eligibility questions

Port: 5000 (configurable via .env file)

Note: Works even without OpenAI API key (uses fallback responses)
============================================================================
"""

from flask import Flask, request, jsonify  # Flask web framework
from flask_cors import CORS                 # Allow cross-origin requests
import os                                   # Access environment variables
from groq import Groq                    # Groq API client
from dotenv import load_dotenv              # Load .env file
import base64                                # For image processing
import json                                  # For parsing AI responses

# Load environment variables from .env file
load_dotenv()

# Create Flask application
app = Flask(__name__)

# Enable CORS - allows backend (localhost:8000) to call this service
CORS(app)

# ============================================================================
# GROQ CLIENT INITIALIZATION (UPGRADED FROM OPENAI)
# ============================================================================
# Initialize Groq client if API key is available
# If no API key, service will use rule-based fallback responses

groq_api_key = os.getenv("GROQ_API_KEY")
if groq_api_key:
    client = Groq(api_key=groq_api_key)
    print("✅ Groq LPU connected - using Llama 3.1/3.2 for AI")
else:
    client = None
    print("⚠️  Warning: GROQ_API_KEY not set, using fallback responses")

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/health', methods=['GET'])
def health():
    """
    Health Check Endpoint
    GET /health
    
    Purpose: Check if AI service is running
    Response: {"status": "healthy", "service": "ai-chatbot"}
    """
    return jsonify({"status": "healthy", "service": "ai-chatbot"})

@app.route('/chat', methods=['POST'])
def chat():
    """
    Chat Endpoint
    POST /chat
    
    Purpose: Handle farmer questions about government schemes
    
    Request Body:
    {
        "message": "What is PM-KISAN?",      # Farmer's question
        "language": "en",                     # Language code (en, hi, etc.)
        "context": "Farmer profile info"      # Optional: farmer details
    }
    
    Response:
    {
        "response": "PM-KISAN provides...",   # AI response
        "language": "en"
    }
    """
    try:
        # Get request data from frontend
        data = request.json
        message = data.get('message', '')      # Farmer's question
        language = data.get('language', 'en')  # Language: 'en' (English), 'hi' (Hindi)
        context = data.get('context', '')      # Optional: farmer profile for better recommendations

        # Validate input
        if not message:
            return jsonify({"error": "Message is required"}), 400

        # Build AI system prompt - tells AI how to behave
        system_prompt = f"""You are an AI assistant helping farmers in India understand government schemes and get recommendations.

You can help with:
- Explaining government schemes (PM-KISAN, PMFBY, MGNREGA, Soil Health Card, Irrigation schemes, etc.)
- Recommending schemes based on farmer profile
- Answering questions about eligibility criteria
- Providing application guidance

{context}

Respond in {language} language. Be helpful, clear, and supportive. Keep responses concise and practical."""

        # ====================================================================
        # ATTEMPT GROQ API CALL (UPGRADED)
        # ====================================================================
        # Use Groq Llama 3.1 for high-performance text generation
        
        if client:
            try:
                # Call Groq API with farmer's question
                response = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",  # Latest Groq model
                    messages=[
                        {"role": "system", "content": system_prompt},  # AI instructions
                        {"role": "user", "content": message}           # Farmer's question
                    ],
                    temperature=0.7,
                    max_tokens=1024
                )
                # Return AI-generated response
                return jsonify({
                    "response": response.choices[0].message.content,
                    "language": language
                })
            except Exception as e:
                print(f"⚠️  Groq API error: {e}")
                import traceback
                traceback.print_exc()
                # Fallback handled below

        # ====================================================================
        # FALLBACK RESPONSES
        # ====================================================================
        # If OpenAI is not available or fails, use rule-based responses
        # These are predefined answers for common questions
        
        return jsonify({
            "response": get_fallback_response(message, language),
            "language": language
        })

    except Exception as e:
        print(f"❌ Chat error: {e}", flush=True)
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Chat service error", "details": str(e)}), 500

@app.route('/verify-document', methods=['POST'])
def verify_document():
    """
    Fake Document Detection Endpoint (Groq Vision)
    POST /verify-document
    """
    try:
        data = request.json
        image_data = data.get('image')  # Base64 string
        doc_type = data.get('doc_type', 'government document')

        if not image_data:
            return jsonify({"error": "Image data is required"}), 400

        if not client:
            return jsonify({
                "error": "Groq API not configured",
                "fraud_likelihood": "Unknown",
                "analysis": "AI verification is currently offline."
            }), 503

        # Vision instruction prompt
        vision_prompt = f"""Analyze this {doc_type} for security and authenticity. 
Look specifically for signs of 'fake' or 'tampered' status:
1. Text anomalies: Misaligned characters, different font weights in critical areas.
2. Digital manipulation: Blurred edges around names, dates, or numbers.
3. Official markers: Check for existence of stamps, seals, or QR codes.
4. Logic check: Does the data presented seem consistent?

Return your response in a structured JSON string format:
{{
  "genuine_probability": 0-100,
  "risk_level": "Low/Medium/High",
  "findings": ["Point 1", "Point 2"],
  "is_likely_fake": true/false,
  "summary": "Overall verdict"
}}
Wait, provide ONLY the JSON object back."""

        completion = client.chat.completions.create(
            model="llama-3.2-11b-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": vision_prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_data}",
                            },
                        },
                    ],
                }
            ],
            temperature=0,
            response_format={"type": "json_object"}
        )

        # Parse the JSON string from AI and return as object
        try:
            result = json.loads(completion.choices[0].message.content)
            return jsonify(result)
        except Exception:
            # Fallback if AI doesn't return clean JSON
            return jsonify({
                "genuine_probability": 0,
                "risk_level": "High",
                "findings": ["Error parsing AI response"],
                "is_likely_fake": True,
                "summary": "Could not parse verification results."
            })

    except Exception as e:
        print(f"❌ Verification error: {e}")
        return jsonify({"error": "Verification failed"}), 500

def get_fallback_response(message: str, language: str) -> str:
    """Rule-based fallback responses"""
    msg_lower = message.lower()

    if language == 'hi':
        if 'pm-kisan' in msg_lower or 'kisan' in msg_lower:
            return 'PM-KISAN योजना किसानों को प्रत्यक्ष आय सहायता प्रदान करती है। यदि आपके पास 2 हेक्टेयर तक जमीन है और आपकी आय कम है, तो आप इस योजना के लिए पात्र हो सकते हैं। आपको वर्ष में ₹6,000 तीन किस्तों में मिलेंगे।'
        if 'insurance' in msg_lower or 'bima' in msg_lower:
            return 'PMFBY (प्रधानमंत्री फसल बीमा योजना) फसल बीमा प्रदान करती है। यह कम प्रीमियम पर फसल नुकसान से सुरक्षा देती है।'
        if 'mgnrega' in msg_lower or 'रोजगार' in msg_lower:
            return 'MGNREGA ग्रामीण क्षेत्रों में 100 दिनों की गारंटीशुदा रोजगार प्रदान करती है। यह गरीबी रेखा से नीचे और कम आय वाले परिवारों के लिए है।'
        return 'मैं आपकी मदद कर सकता हूं। कृपया PM-KISAN, PMFBY, MGNREGA, या अन्य योजनाओं के बारे में पूछें।'

    # English fallback
    if 'pm-kisan' in msg_lower or 'kisan' in msg_lower:
        return 'PM-KISAN provides direct income support to farmers. If you have up to 2 hectares of land and low income, you may be eligible. You\'ll receive ₹6,000 per year in three installments.'
    if 'insurance' in msg_lower or 'bima' in msg_lower:
        return 'PMFBY (Pradhan Mantri Fasal Bima Yojana) provides crop insurance. It offers protection against crop loss at low premium rates.'
    if 'mgnrega' in msg_lower or 'employment' in msg_lower:
        return 'MGNREGA provides 100 days of guaranteed employment in rural areas. It\'s for Below Poverty Line and low-income families.'
    return 'I can help you with government schemes. Please ask about PM-KISAN, PMFBY, MGNREGA, or other schemes.'

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
