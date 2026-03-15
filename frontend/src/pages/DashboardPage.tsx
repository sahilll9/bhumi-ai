import { useEffect, useState } from 'react';
import { dashboardAPI } from '../utils/api';
import ActivityMap from '../components/dashboard/ActivityMap';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts';
import { Map, Users, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

interface DashboardStats {
  total_villages: number;
  total_farmers: number;
  total_schemes: number;
  high_priority_villages: number;
  anomaly_villages: number;
  avg_trust_score: number;
  total_verifications: number;
}

/**
 * ============================================================================
 * PREMIUM DASHBOARD PAGE
 * ============================================================================
 * Modern data visualization using Glassmorphism and Recharts.
 * Provides at-a-glance insight into rural survey data.
 * ============================================================================
 */

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6 rounded-3xl"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <h3 className="text-earth-800/40 text-xs font-black uppercase tracking-widest mb-1">{title}</h3>
    <p className="text-3xl font-black text-earth-900">{value}</p>
  </motion.div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();

    // Auto-refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Data acquisition failed:', err);
      setError('Could not connect to the backend database. Please check if your PostgreSQL and Backend server are running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-12 w-12 border-4 border-bhumi-primary/20 border-t-bhumi-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <AlertTriangle className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-bold text-earth-900">Connection Error</h2>
        <p className="text-earth-800/60 max-w-md">{error}</p>
        <button
          onClick={() => { setLoading(true); loadStats(); }}
          className="px-6 py-2 bg-bhumi-dark text-white rounded-xl font-bold hover:bg-black transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const priorityData = [
    { name: 'High', value: stats.high_priority_villages },
    { name: 'Med', value: stats.total_villages - stats.high_priority_villages - stats.anomaly_villages },
    { name: 'Low', value: stats.total_villages - stats.high_priority_villages }
  ];

  const CHARTS_COLORS = ['#f97316', '#4ade80', '#1a2e1a'];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-black text-earth-900 tracking-tighter">Command Center</h1>
          <p className="text-earth-800/60 font-medium">Real-time rural intelligence overview</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white/50 backdrop-blur-md border border-white/40 rounded-xl text-xs font-black text-earth-800/40">
            V.1.0.4 LIVE
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Villages" value={stats.total_villages} icon={Map} color="bg-bhumi-dark" delay={0.1} />
        <StatCard title="Farmers" value={stats.total_farmers.toLocaleString()} icon={Users} color="bg-bhumi-primary" delay={0.2} />
        <StatCard title="Land Verif." value={stats.total_verifications} icon={ShieldCheck} color="bg-bhumi-deep" delay={0.3} />
        <StatCard title="Anomalies" value={stats.anomaly_villages} icon={AlertTriangle} color="bg-saffron" delay={0.4} />
        <StatCard title="Accuracy" value={`${(stats.avg_trust_score * 100).toFixed(1)}%`} icon={Activity} color="bg-green-600" delay={0.5} />
      </div>

      {/* Geographic Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-2 rounded-[40px] w-full mb-8 relative z-10 border border-white/40 shadow-xl"
      >
        <div className="px-6 md:px-8 pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h3 className="text-xl md:text-2xl font-black text-earth-900 flex items-center gap-3">
            <Map className="w-6 h-6 text-bhumi-primary" /> Geographic Intelligence
          </h3>
          <div className="flex items-center gap-2 px-4 py-2 bg-bhumi-primary/10 rounded-xl text-bhumi-dark font-bold text-sm">
            <div className="w-2 h-2 rounded-full bg-bhumi-primary animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            Live Node Tracking
          </div>
        </div>
        <ActivityMap />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Priority Analysis Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-[40px] lg:col-span-2"
        >
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-earth-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-bhumi-primary" /> Priority Distribution
            </h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#1c1917', fontSize: 12, fontWeight: 700 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(74, 222, 128, 0.1)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {priorityData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHARTS_COLORS[index % CHARTS_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Secondary Metrics Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 rounded-[40px] bg-bhumi-dark text-white"
        >
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-white/50">
            <ShieldCheck className="w-5 h-5" /> Safety & Trust
          </h3>

          <div className="space-y-10">
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-bold opacity-60">
                <span>ANOMALY RATE</span>
                <span>{((stats.anomaly_villages / stats.total_villages) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.anomaly_villages / stats.total_villages) * 100}%` }}
                  className="h-full bg-saffron"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-bold opacity-60">
                <span>TRUST THRESHOLD</span>
                <span>{(stats.avg_trust_score * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.avg_trust_score * 100}%` }}
                  className="h-full bg-bhumi-primary"
                />
              </div>
            </div>

            <div className="pt-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-xs font-black opacity-40 mb-2">ACTIVE SCHEMES</h4>
                <p className="text-4xl font-black text-bhumi-primary">{stats.total_schemes}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
