import { useEffect, useState } from 'react';
import { villagesAPI } from '../utils/api';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, AlertCircle, ChevronRight, Filter } from 'lucide-react';

interface Village {
  id: number;
  village_name: string;
  district_name: string;
  state_name: string;
  indicators: {
    agri_dependency: number;
    irrigation_stress: number;
    connectivity_risk: number;
  };
  priority: {
    score: number;
    level: string;
  };
  recommended_schemes: string[];
  anomaly: {
    flag: boolean;
    reason: string | null;
  };
}

/**
 * ============================================================================
 * VILLAGES INTELLIGENCE PAGE
 * ============================================================================
 * Overview of surveyed villages with priority levels and anomaly detection.
 * Uses Glassmorphism for a clean, modern data view.
 * ============================================================================
 */

export default function VillagesPage() {
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ district: '', state: '' });

  useEffect(() => {
    loadVillages();
  }, [filter]);

  const loadVillages = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filter.district) params.district = filter.district;
      if (filter.state) params.state = filter.state;

      const response = await villagesAPI.getAll(params);
      setVillages(response.data);
    } catch (error) {
      console.error('Village data fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyles = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Medium': return 'bg-saffron/10 text-saffron border-saffron/20';
      default: return 'bg-bhumi-primary/10 text-bhumi-dark border-bhumi-primary/20';
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-earth-900 tracking-tighter">Village Intelligence</h1>
          <p className="text-earth-800/60 font-medium">Granular ground data from across Bharat</p>
        </div>

        {/* Modern Search/Filter UI */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-800/30" />
            <input
              type="text"
              placeholder="Search district..."
              value={filter.district}
              onChange={(e) => setFilter({ ...filter, district: e.target.value })}
              className="w-full pl-11 pr-4 py-3 bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-bhumi-primary/20 focus:border-bhumi-primary outline-none transition-all"
            />
          </div>
          <div className="p-3 bg-bhumi-dark text-white rounded-2xl cursor-pointer hover:bg-black transition-colors">
            <Filter className="w-5 h-5" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="h-10 w-10 border-4 border-bhumi-primary/20 border-t-bhumi-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {villages.map((village, idx) => (
              <motion.div
                key={village.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card p-8 rounded-[32px] flex flex-col group h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-earth-900 group-hover:text-bhumi-dark transition-colors">
                      {village.village_name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-earth-800/40 uppercase tracking-widest mt-1">
                      <MapPin className="w-3 h-3" /> {village.district_name}, {village.state_name}
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getPriorityStyles(village.priority.level)}`}>
                    {village.priority.level} PRIORITY
                  </span>
                </div>

                {/* Technical Indicators */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-3 bg-earth-100/50 rounded-2xl">
                    <p className="text-[10px] font-black text-earth-800/30 uppercase mb-1">Irrigation</p>
                    <p className="text-lg font-black text-earth-900">{(village.indicators.irrigation_stress * 100).toFixed(0)}%</p>
                  </div>
                  <div className="p-3 bg-earth-100/50 rounded-2xl">
                    <p className="text-[10px] font-black text-earth-800/30 uppercase mb-1">Agri Dep</p>
                    <p className="text-lg font-black text-earth-900">{(village.indicators.agri_dependency * 100).toFixed(0)}%</p>
                  </div>
                </div>

                {/* Anomaly Notification */}
                {village.anomaly.flag && (
                  <div className="mb-6 p-4 rounded-2xl bg-saffron/5 border border-saffron/20 flex gap-3 items-start">
                    <AlertCircle className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-black text-saffron uppercase mb-0.5">Anomaly Detected</p>
                      <p className="text-[11px] font-bold text-earth-900 leading-tight">{village.anomaly.reason}</p>
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-6 border-t border-earth-900/5 flex justify-between items-center">
                  <Link
                    to={`/villages/${village.id}`}
                    className="text-sm font-black text-bhumi-dark flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    ANALYZE DATA <ChevronRight className="w-4 h-4" />
                  </Link>
                  <div className="flex -space-x-2">
                    {[1, 2].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-earth-200" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && villages.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 glass-card rounded-[40px]"
        >
          <Search className="w-12 h-12 text-earth-800/10 mx-auto mb-4" />
          <p className="text-earth-800/40 font-bold uppercase tracking-widest">No village data found matching your query</p>
        </motion.div>
      )}
    </div>
  );
}
