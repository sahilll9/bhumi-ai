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
from openai import OpenAI                      # OpenAI API client

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
    print("[+] Groq LPU connected - using Llama 3.1/3.2 for AI")
else:
    client = None
    print("[!] Warning: GROQ_API_KEY not set, using fallback responses")

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
        model_selection = data.get('model', 'llama') # 'llama', 'chatgpt', 'claude', 'custom'
        custom_api_key = data.get('apiKey', '')

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
        # ATTEMPT GROQ/OPENAI API CALL DYNAMICALLY
        # ====================================================================
        
        dynamic_client = None
        target_model = ""

        if model_selection == 'chatgpt':
            target_model = "gpt-3.5-turbo"
            api_key_to_use = custom_api_key if custom_api_key else os.getenv("OPENAI_API_KEY")
            if api_key_to_use:
                dynamic_client = OpenAI(api_key=api_key_to_use)
        elif model_selection == 'claude':
            # Fallback to standard OpenAI client format for Claude proxy endpoints
            target_model = "claude-3-haiku-20240307" 
            api_key_to_use = custom_api_key if custom_api_key else os.getenv("ANTHROPIC_API_KEY")
            if api_key_to_use:
                 dynamic_client = OpenAI(api_key=api_key_to_use)
        elif model_selection == 'custom':
            target_model = "gpt-3.5-turbo" # Defaulting to OpenAI compatible structure
            api_key_to_use = custom_api_key
            if api_key_to_use:
                dynamic_client = OpenAI(api_key=api_key_to_use)
        else:
            # Default: Llama via Groq
            target_model = "llama-3.3-70b-versatile"
            api_key_to_use = custom_api_key if custom_api_key else os.getenv("GROQ_API_KEY")
            if api_key_to_use:
                dynamic_client = Groq(api_key=api_key_to_use)
        
        if dynamic_client:
            try:
                # Call API with farmer's question
                response = dynamic_client.chat.completions.create(
                    model=target_model,
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
                print(f"[!] API error with {model_selection}: {e}")
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
        print(f"[-] Chat error: {e}", flush=True)
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
        print(f"[-] Verification error: {e}")
        return jsonify({"error": "Verification failed"}), 500

def get_fallback_response(message: str, language: str) -> str:
    """Enhanced Rule-based fallback responses (Offline Engine)"""
    msg_lower = message.lower()

    if language == 'hi':
        if 'pm-kisan' in msg_lower or 'kisan' in msg_lower or '6000' in msg_lower:
            return 'PM-KISAN योजना के तहत छोटे और सीमांत किसानों को ₹6,000 प्रति वर्ष 3 किस्तों में मिलते हैं। इसके लिए आपका बैंक खाता आधार से लिंक होना चाहिए।'
        if 'insurance' in msg_lower or 'bima' in msg_lower or 'बीमा' in msg_lower or 'pmfby' in msg_lower:
            return 'PMFBY (प्रधानमंत्री फसल बीमा योजना) प्राकृतिक आपदाओं, कीटों और बीमारियों के कारण फसल के नुकसान पर वित्तीय सहायता प्रदान करती है। खरीफ के लिए 2% और रबी के लिए 1.5% प्रीमियम है।'
        if 'mgnrega' in msg_lower or 'रोजगार' in msg_lower or 'मनरेगा' in msg_lower:
            return 'MGNREGA ग्रामीण क्षेत्रों में 100 दिनों के रोजगार की गारंटी देता है। यह अकुशल शारीरिक कार्य के लिए न्यूनतम मजदूरी सुनिश्चित करता है।'
        if 'soil' in msg_lower or 'मिट्टी' in msg_lower or 'मृदा' in msg_lower:
            return 'मृदा स्वास्थ्य कार्ड (Soil Health Card) योजना किसानों को उनकी मिट्टी की स्थिति और आवश्यक उर्वरकों के बारे में जानकारी देती है, जिससे उपज बढ़ती है।'
        if 'loan' in msg_lower or 'kcc' in msg_lower or 'कर्ज' in msg_lower or 'ऋण' in msg_lower:
            return 'किसान क्रेडिट कार्ड (KCC) योजना किसानों को खेती के खर्चों के लिए कम ब्याज दर पर संस्थागत ऋण प्रदान करती है।'
        if 'subsidy' in msg_lower or 'सब्सिडी' in msg_lower or 'tractor' in msg_lower or 'मशीन' in msg_lower:
            return 'विभिन्न राज्य और केंद्र सरकारें कृषि मशीनरी (जैसे ट्रैक्टर, रोटावेटर) पर 20% से 50% तक की सब्सिडी (SMAM योजना) प्रदान करती हैं।'
        if 'irrigation' in msg_lower or 'सिंचाई' in msg_lower or 'pmksy' in msg_lower:
            return 'PMKSY (प्रधानमंत्री कृषि सिंचाई योजना) का उद्देश्य खेत में पानी की पहुंच में सुधार करना और पानी के उपयोग की दक्षता बढ़ाना है (प्रति बूंद अधिक फसल)।'
        return 'मैं आपकी मदद कर सकता हूं। कृपया PM-KISAN, PMFBY, KCC, सब्सिडी, मिट्टी स्वास्थ्य या सिंचाई योजनाओं के बारे में पूछें। (ऑफ़लाइन मोड)'

    # English fallback
    if 'pm-kisan' in msg_lower or 'kisan' in msg_lower or '6000' in msg_lower:
        return 'PM-KISAN provides direct income support of ₹6,000 per year in 3 equal installments to eligible farmers. Ensure your bank account is Aadhaar-seeded.'
    if 'insurance' in msg_lower or 'bima' in msg_lower or 'pmfby' in msg_lower or 'crop loss' in msg_lower:
        return 'PMFBY (Pradhan Mantri Fasal Bima Yojana) provides financial support for crop loss due to natural calamities, pests, and diseases. Premium is 2% for Kharif and 1.5% for Rabi.'
    if 'mgnrega' in msg_lower or 'employment' in msg_lower:
        return 'MGNREGA provides 100 days of guaranteed wage employment in rural areas for unskilled manual work.'
    if 'soil' in msg_lower or 'fertilizer' in msg_lower or 'health card' in msg_lower:
        return 'The Soil Health Card Scheme provides information on your soil nutrient status and recommendations on appropriate dosage of nutrients/fertilizers.'
    if 'loan' in msg_lower or 'kcc' in msg_lower or 'credit' in msg_lower:
        return 'Kisan Credit Card (KCC) scheme provides farmers with timely access to adequate institutional credit for agricultural expenses at low interest rates.'
    if 'subsidy' in msg_lower or 'tractor' in msg_lower or 'machinery' in msg_lower or 'equipment' in msg_lower:
        return 'Under the Sub-Mission on Agricultural Mechanization (SMAM), governments provide 20% to 50% subsidy for purchasing agricultural machinery like tractors.'
    if 'irrigation' in msg_lower or 'pmksy' in msg_lower or 'water' in msg_lower:
        return 'PMKSY (Pradhan Mantri Krishi Sinchayee Yojana) focuses on improving water access on farms and enhancing water use efficiency (More crop per drop).'
    return 'I can help you with government schemes. Please ask about PM-KISAN, PMFBY, KCC, Subsidies, Soil Health, or Irrigation schemes. (Offline mode)'

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
