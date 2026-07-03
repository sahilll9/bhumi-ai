import { useState, useRef, useEffect } from 'react';
import { chatbotAPI } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Languages, Sparkles, FileSearch, ShieldCheck, AlertTriangle, X, Loader2, Mic, MicOff, Keyboard as KeyboardIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import hindiLayout from 'simple-keyboard-layouts/build/layouts/hindi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  language?: string;
  isVerification?: boolean;
  verificationData?: any;
}

/**
 * ============================================================================
 * CHATBOT ASSISTANT PAGE
 * ============================================================================
 * Multilingual AI assistant for rural schemes.
 * Features a modern, conversational UI with glassmorphism and smooth animations.
 * ============================================================================
 */

export default function ChatbotPage() {
  const { language, setLanguage } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: language === 'hi' ? "नमस्ते! मैं आपका भूमि एआई सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?"
        : language === 'te' ? "నమస్కారం! నేను మీ భూమి AI సహాయకుడిని. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?"
          : language === 'ta' ? "வணக்கம்! நான் உங்கள் பூமி AI உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?"
            : "Namaste! I'm your Bhumi AI assistant. I can guide you through government schemes. How can I help you today?",
      language: language
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Online/Offline Mode State
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const [model, setModel] = useState<string>('llama');
  const [apiKey, setApiKey] = useState<string>('');

  // Keyboard State
  const [showKeyboard, setShowKeyboard] = useState(false);
  const keyboard = useRef<any>(null);

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Voice Recognition Setup
  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Set language based on app context
      switch (language) {
        case 'hi': recognition.lang = 'hi-IN'; break;
        case 'te': recognition.lang = 'te-IN'; break;
        case 'ta': recognition.lang = 'ta-IN'; break;
        default: recognition.lang = 'en-IN';
      }

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev ? prev + ' ' + transcript : transcript);
        if (keyboard.current) {
          keyboard.current.setInput(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const handleKeyboardChange = (i: string) => {
    setInput(i);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || loading) return;

    if (selectedFile) {
      await handleVerifyDocument();
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      language
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    if (keyboard.current) keyboard.current.setInput('');
    setShowKeyboard(false);
    setLoading(true);

    try {
      const response = await chatbotAPI.chat({
        message: input,
        language,
        mode,
        model,
        apiKey
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response,
        language: response.data.language || language
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Link failure:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, I lost connection to the primary AI node. Please try again.',
        language
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDocument = async () => {
    if (!selectedFile) return;

    const userMessage: Message = {
      role: 'user',
      content: `Scanning document: ${selectedFile.name}`,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    const fileToUpload = selectedFile;
    clearFile();

    try {
      const formData = new FormData();
      formData.append('image', fileToUpload);
      formData.append('doc_type', 'land document');

      const response = await chatbotAPI.verifyDocument(formData);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.summary || 'Document analysis complete.',
        isVerification: true,
        verificationData: response.data
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Verification failure:', error);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'I encountered an error while verifying the document. Please ensure it is a valid image file.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10 h-[calc(100vh-200px)] flex flex-col">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
        <div>
          <h1 className="text-3xl font-black text-earth-900 tracking-tighter flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-bhumi-primary" /> {language === 'hi' ? 'बहुभाषी एआई' : language === 'te' ? 'బహుభాషా AI' : language === 'ta' ? 'பன்மொழி AI' : 'Multi-Lingual AI'}
          </h1>
          <p className="text-earth-800/60 font-medium mb-4 md:mb-0">
            {language === 'hi' ? '12+ बोलियों में इंटरैक्टिव योजना सलाहकार' : 'Interactive scheme advisory across 12+ dialects'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          {/* Mode Toggle */}
          <div className="glass-card !bg-white/40 px-4 py-2 flex items-center gap-3 rounded-2xl border-white/60">
            <span className="text-sm font-bold text-earth-900">{mode === 'online' ? 'Online' : 'Offline'}</span>
            <button
              onClick={() => setMode(mode === 'online' ? 'offline' : 'online')}
              className={`w-10 h-6 rounded-full p-1 transition-colors flex items-center ${mode === 'online' ? 'bg-bhumi-primary' : 'bg-earth-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${mode === 'online' ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Model Selector (Visible only in Online Mode) */}
          {mode === 'online' && (
            <div className="glass-card !bg-white/40 px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-2xl border-white/60">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-transparent text-sm font-black outline-none cursor-pointer text-earth-900"
              >
                <option value="llama">Llama 3.3 (Groq)</option>
                <option value="chatgpt">ChatGPT (OpenAI)</option>
                <option value="claude">Claude (Anthropic)</option>
                <option value="custom">Custom Model</option>
              </select>
              
              {(model === 'chatgpt' || model === 'claude' || model === 'custom') && (
                <input
                  type="password"
                  placeholder="API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-white/50 border border-white/60 rounded-xl px-3 py-1 text-xs outline-none focus:ring-2 focus:ring-bhumi-primary/50 w-full sm:w-32"
                />
              )}
            </div>
          )}

          {/* Premium Language Selector */}
          <div className="glass-card !bg-white/40 px-4 py-2 flex items-center gap-3 rounded-2xl border-white/60">
            <Languages className="w-5 h-5 text-earth-800/30" />
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value as any);
                if (e.target.value !== 'hi') setShowKeyboard(false);
              }}
              className="bg-transparent text-sm font-black outline-none cursor-pointer text-earth-900"
            >
              <option value="en">English (Global)</option>
              <option value="hi">हिंदी (Bharat)</option>
              <option value="te">తెలుగు (Telangana)</option>
              <option value="ta">தமிழ் (Tamil Nadu)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 glass-card rounded-[40px] flex flex-col overflow-hidden relative border-white/40 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white/20 to-transparent pointer-events-none z-10" />

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-bhumi-dark' : 'bg-bhumi-primary'
                  }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                </div>

                <div className={`max-w-[75%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-6 py-4 rounded-3xl text-sm font-bold leading-relaxed shadow-sm ${msg.role === 'user'
                    ? 'bg-bhumi-dark text-white rounded-tr-none'
                    : 'bg-white/80 backdrop-blur-md text-earth-900 rounded-tl-none border border-white/40'
                    }`}>
                    {msg.content}

                    {msg.isVerification && msg.verificationData && (
                      <div className="mt-4 pt-4 border-t border-earth-100/50 space-y-4 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest opacity-40">Fraud Analysis Report</span>
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${msg.verificationData.risk_level === 'High' ? 'bg-red-500/10 text-red-600' :
                            msg.verificationData.risk_level === 'Medium' ? 'bg-orange-500/10 text-orange-600' :
                              'bg-green-500/10 text-green-600'
                            }`}>
                            {msg.verificationData.risk_level === 'High' ? <AlertTriangle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                            {msg.verificationData.risk_level} RISK
                          </div>
                        </div>

                        <div className="bg-earth-50/50 rounded-2xl p-4 space-y-3 font-medium">
                          <div className="flex items-center justify-between text-xs">
                            <span className="opacity-60 text-earth-900">Genuine Probability:</span>
                            <span className={`font-black ${msg.verificationData.genuine_probability > 70 ? 'text-green-600' : 'text-red-600'}`}>
                              {msg.verificationData.genuine_probability}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-earth-200/30 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ${msg.verificationData.genuine_probability > 70 ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${msg.verificationData.genuine_probability}%` }}
                            />
                          </div>
                        </div>

                        {msg.verificationData.findings && (
                          <ul className="space-y-2">
                            {msg.verificationData.findings.map((finding: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-[11px] leading-tight opacity-70 italic">
                                <div className="w-1 h-1 rounded-full bg-bhumi-primary mt-1.5 shrink-0" />
                                {finding}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] font-black opacity-20 uppercase tracking-widest px-2">
                    {msg.role === 'user' ? 'CITIZEN' : 'BHUMI AI'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-bhumi-primary flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white/40 backdrop-blur-md px-6 py-4 rounded-3xl rounded-tl-none border border-white/40 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-bhumi-dark rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-bhumi-dark rounded-full animate-bounce delay-75" />
                <div className="w-1.5 h-1.5 bg-bhumi-dark rounded-full animate-bounce delay-150" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* High-End Input Field */}
        <div className="p-6 bg-white/20 backdrop-blur-2xl border-t border-white/20 relative">

          {/* File Preview Toggle */}
          <AnimatePresence>
            {previewUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute -top-32 left-8 p-3 glass-card rounded-2xl flex items-center gap-4 bg-white/80 shadow-2xl border-bhumi-primary/20"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/60 shadow-inner">
                  <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                </div>
                <div className="pr-4">
                  <p className="text-[10px] font-black text-earth-900/40 uppercase tracking-widest">Selected Document</p>
                  <p className="text-sm font-black text-earth-900 truncate max-w-[150px]">{selectedFile?.name}</p>
                </div>
                <button
                  onClick={clearFile}
                  className="w-8 h-8 rounded-full bg-earth-100 flex items-center justify-center hover:bg-earth-200 transition-colors"
                >
                  <X className="w-4 h-4 text-earth-600" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="max-w-4xl mx-auto flex gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-5 rounded-[24px] shadow-xl transition-all active:scale-95 flex items-center gap-2 ${selectedFile ? 'bg-bhumi-primary text-white' : 'bg-white text-earth-600 hover:bg-earth-50'
                }`}
            >
              <FileSearch className="w-6 h-6" />
            </button>

            <div className="relative flex-1 flex items-center bg-white shadow-xl rounded-[24px] border border-white focus-within:ring-4 focus-within:ring-bhumi-primary/10 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (keyboard.current) keyboard.current.setInput(e.target.value);
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={selectedFile
                  ? (language === 'hi' ? "एक नोट जोड़ें या स्कैन करें..." : "Add a note or click Broadcast to Scan...")
                  : (language === 'hi' ? "सब्सिडी, पात्रता, या दस्तावेज़ के बारे में पूछें..." : "Ask about subsidies, eligibility, or documentation...")
                }
                className="w-full pl-6 pr-24 py-5 bg-transparent text-earth-900 font-bold placeholder:text-earth-800/20 outline-none"
                disabled={loading}
              />

              {/* Voice and Keyboard Action Buttons inside Input */}
              <div className="absolute right-3 flex items-center gap-1">
                {language === 'hi' && (
                  <button
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    className={`p-2 rounded-xl transition-all ${showKeyboard ? 'bg-bhumi-primary/20 text-bhumi-primary' : 'hover:bg-earth-50 text-earth-400'}`}
                    title="Toggle Hindi Keyboard"
                  >
                    <KeyboardIcon className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={toggleListen}
                  className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20' : 'hover:bg-earth-50 text-earth-400'}`}
                  title={isListening ? "Stop Listening" : "Start Voice Input"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={loading || (!input.trim() && !selectedFile)}
              className="px-8 py-5 bg-bhumi-dark text-white rounded-[24px] shadow-xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2"
            >
              <span className="font-black text-sm tracking-widest uppercase hidden sm:block">
                {selectedFile
                  ? (language === 'hi' ? 'स्कैन करें' : 'Perform Scan')
                  : (language === 'hi' ? 'भेजें' : 'Broadcast')
                }
              </span>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (selectedFile ? <ShieldCheck className="w-5 h-5" /> : <Send className="w-5 h-5" />)}
            </button>
          </div>

          {/* Virtual Keyboard Expansion */}
          <AnimatePresence>
            {showKeyboard && language === 'hi' && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="max-w-4xl mx-auto bg-earth-50 rounded-2xl p-2 shadow-inner border border-earth-200/50">
                  <Keyboard
                    keyboardRef={r => (keyboard.current = r)}
                    layoutName="default"
                    onChange={handleKeyboardChange}
                    layout={hindiLayout.layout}
                    theme={"hg-theme-default custom-keyboard-theme"}
                    buttonTheme={[
                      {
                        class: "custom-key",
                        buttons: "{bksp} {enter} {shift} {space}"
                      }
                    ]}
                  />
                  {/* Small style tag specifically for our custom keyboard theme */}
                  <style>{`
                    .custom-keyboard-theme { background-color: transparent; }
                    .hg-button { border-radius: 8px !important; font-weight: 600 !important; color: #1c1917 !important; border-bottom: 2px solid #e7e5e4 !important; }
                    .hg-button:active { border-bottom-width: 0px !important; transform: translateY(2px); }
                    .custom-key { background-color: #f5f5f4 !important; color: #78716c !important; }
                  `}</style>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
