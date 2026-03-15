import { useState } from 'react';
import { farmersAPI } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, ExternalLink, Lightbulb, ClipboardList, LandPlot, Sprout, Wallet, Droplets, ArrowRight, RefreshCw } from 'lucide-react';

interface SchemeRecommendation {
  scheme: {
    id: number;
    name: string;
    code: string;
    description: string;
    benefits: string;
    application_link: string;
    category: string;
  };
  eligibility_score: number;
  confidence: number;
  reason: string;
  match_criteria: any;
}

export default function SchemeAdvisorPage() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<SchemeRecommendation[]>([]);
  const [showResults, setShowResults] = useState(false);

  const [formData, setFormData] = useState({
    land_size_hectares: '',
    crop_type: '',
    irrigation_access: 'false',
    income_category: '',
    state: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await farmersAPI.matchSchemes(formData);
      setRecommendations(response.data);
      setShowResults(true);
      // Wait for results to show before scrolling
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      land_size_hectares: '',
      crop_type: '',
      irrigation_access: 'false',
      income_category: '',
      state: ''
    });
    setRecommendations([]);
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-bhumi-primary';
    if (score >= 0.5) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 bg-bhumi-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-bhumi-dark/20"
        >
          <Sparkles className="w-8 h-8 text-bhumi-primary" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-earth-900 tracking-tighter">AI Scheme Advisor</h1>
        <p className="text-earth-800/60 font-medium max-w-xl mx-auto">
          Answer a few questions to find the best government schemes, insurance, and policies for your farm.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Questionnaire Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-[40px] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ClipboardList className="w-48 h-48" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Land Size */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-black text-earth-900 uppercase tracking-widest">
                  <LandPlot className="w-4 h-4 text-bhumi-primary" /> Land Size (Hectares)
                </label>
                <input
                  required
                  type="number"
                  step="0.1"
                  name="land_size_hectares"
                  value={formData.land_size_hectares}
                  onChange={handleInputChange}
                  placeholder="e.g. 2.5"
                  className="w-full px-6 py-4 rounded-2xl bg-white/50 border border-white focus:bg-white focus:ring-4 focus:ring-bhumi-primary/10 outline-none transition-all font-bold"
                />
              </div>

              {/* Crop Type */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-black text-earth-900 uppercase tracking-widest">
                  <Sprout className="w-4 h-4 text-bhumi-primary" /> Primary Crop
                </label>
                <select
                  required
                  name="crop_type"
                  value={formData.crop_type}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 rounded-2xl bg-white/50 border border-white focus:bg-white focus:ring-4 focus:ring-bhumi-primary/10 outline-none transition-all font-bold appearance-none"
                >
                  <option value="">Select Crop Type</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice (Paddy)</option>
                  <option value="cotton">Cotton</option>
                  <option value="sugarcane">Sugarcane</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="pulses">Pulses</option>
                  <option value="fruits">Fruits/Horticulture</option>
                </select>
              </div>

              {/* Income Category */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-black text-earth-900 uppercase tracking-widest">
                  <Wallet className="w-4 h-4 text-bhumi-primary" /> Annual Income
                </label>
                <select
                  required
                  name="income_category"
                  value={formData.income_category}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 rounded-2xl bg-white/50 border border-white focus:bg-white focus:ring-4 focus:ring-bhumi-primary/10 outline-none transition-all font-bold appearance-none"
                >
                  <option value="">Select Category</option>
                  <option value="marginal">Below ₹50,000 (Marginal)</option>
                  <option value="small">₹50,000 - ₹2,00,000 (Small)</option>
                  <option value="medium">₹2,00,000 - ₹5,00,000 (Medium)</option>
                  <option value="large">Above ₹5,00,000 (Large)</option>
                </select>
              </div>

              {/* Irrigation Access */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-black text-earth-900 uppercase tracking-widest">
                  <Droplets className="w-4 h-4 text-bhumi-primary" /> Irrigation Access
                </label>
                <div className="flex gap-4">
                  {['true', 'false'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, irrigation_access: val }))}
                      className={`flex-1 py-4 rounded-2xl font-black transition-all ${formData.irrigation_access === val
                          ? 'bg-bhumi-dark text-white shadow-lg shadow-bhumi-dark/20'
                          : 'bg-white/50 text-earth-900/40 hover:bg-white'
                        }`}
                    >
                      {val === 'true' ? 'YES' : 'NO'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium bg-bhumi-dark text-white hover:bg-black !py-6 text-lg font-black tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <>FIND SUITABLE SCHEMES <ArrowRight className="w-6 h-6" /></>
              )}
            </button>
          </form>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {showResults && (
            <div id="results-section" className="space-y-8 scroll-mt-32">
              <div className="flex justify-between items-center px-4">
                <h2 className="text-xl font-black text-earth-900 tracking-tight">
                  Tailored Recommendations ({recommendations.length})
                </h2>
                <button
                  onClick={resetForm}
                  className="text-xs font-black text-bhumi-primary hover:text-bhumi-dark transition-colors uppercase tracking-widest flex items-center gap-2"
                >
                  <RefreshCw className="w-3 h-3" /> Start Over
                </button>
              </div>

              {recommendations.length === 0 ? (
                <div className="glass-card p-12 text-center rounded-[40px]">
                  <p className="text-earth-800/40 font-bold uppercase tracking-widest">No exact matches found for your profile. Try adjusting details.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {recommendations.map((rec, idx) => (
                    <motion.div
                      key={rec.scheme.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-card p-8 rounded-[40px] shadow-xl hover:shadow-2xl transition-all border-none bg-white/70 backdrop-blur-md"
                    >
                      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
                        <div className="flex items-start gap-6">
                          <div className="bg-bhumi-dark p-5 rounded-[24px] shadow-lg">
                            <Lightbulb className="w-8 h-8 text-bhumi-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="text-3xl font-black text-earth-900 leading-tight">{rec.scheme.name}</h3>
                              <span className="text-[10px] font-black bg-bhumi-primary/10 text-bhumi-dark px-3 py-1.5 rounded-full tracking-widest uppercase">
                                {rec.scheme.category}
                              </span>
                            </div>
                            <p className="text-earth-800/60 font-medium text-base leading-relaxed max-w-xl">{rec.scheme.description}</p>
                          </div>
                        </div>

                        <div className="bg-white p-5 rounded-3xl shadow-sm text-center min-w-[140px] border border-earth-100/50">
                          <div className={`text-5xl font-black ${getScoreColor(rec.eligibility_score)} mb-1 tracking-tighter`}>
                            {(rec.eligibility_score * 100).toFixed(0)}%
                          </div>
                          <div className="text-[10px] font-black text-earth-800/30 uppercase tracking-[0.2em]">MATCH TRUST</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 items-center bg-white/40 p-1 rounded-[32px]">
                        <div className="p-8 rounded-[30px] bg-white shadow-sm border border-earth-100/30">
                          <h4 className="flex items-center gap-2 text-xs font-black text-bhumi-dark uppercase tracking-widest mb-4">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Strategic Benefits
                          </h4>
                          <p className="text-base font-bold text-earth-900 leading-relaxed">{rec.scheme.benefits}</p>
                        </div>

                        <div className="space-y-6">
                          <div className="px-6 py-5 bg-bhumi-dark/5 rounded-[30px] text-sm font-semibold text-earth-800/80 leading-relaxed border border-bhumi-dark/5">
                            <span className="text-bhumi-dark font-black block mb-2 uppercase tracking-widest text-[11px] opacity-40">AI Eligibility Match Analysis</span>
                            {rec.reason}
                          </div>

                          {rec.scheme.application_link && (
                            <a
                              href={rec.scheme.application_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-premium w-full bg-bhumi-dark text-white hover:bg-black !py-5 font-black text-sm tracking-widest uppercase shadow-xl shadow-bhumi-dark/20"
                            >
                              START APPLICATION <ExternalLink className="w-5 h-5 ml-2" />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
