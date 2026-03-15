import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Cpu, Globe, BarChart3, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/**
 * ============================================================================
 * PRE-BUILT COMPONENTS (Internal to Page for portability)
 * ============================================================================
 */
const FeatureCard = ({ icon: Icon, title, desc, color }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass-card p-8 rounded-3xl group"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors shadow-lg ${color}`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-xl font-bold text-earth-900 mb-3 group-hover:text-bhumi-dark transition-colors">{title}</h3>
    <p className="text-earth-800/60 leading-relaxed mb-6 font-medium">{desc}</p>
    <div className="flex items-center text-sm font-bold tracking-tight text-bhumi-dark opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
      EXPLORE CAPABILITIES <ChevronRight className="w-4 h-4 ml-1" />
    </div>
  </motion.div>
);

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-32">
      {/* 1. HERO SECTION - The "First Impression" */}
      <section className="relative text-center max-w-5xl mx-auto py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bhumi-primary/10 border border-bhumi-primary/20 text-bhumi-dark text-xs font-black tracking-widest mb-10"
        >
          <Zap className="w-3 h-3 fill-bhumi-primary" /> NEXT-GEN RURAL INTELLIGENCE
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black text-earth-900 leading-[1.1] tracking-tighter mb-8"
        >
          Digitizing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-bhumi-dark via-bhumi-deep to-bhumi-primary">Heart of Bharat</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-earth-800/60 font-medium max-w-2xl mx-auto leading-relaxed mb-12"
        >
          An AI-first platform dedicated to field survey verification, automated scheme advisory, and granular rural analytics.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-6"
        >
          {user ? (
            <Link to="/dashboard" className="btn-premium bg-bhumi-dark text-white hover:scale-105 px-10 !py-5 text-lg">
              Launch Dashboard <BarChart3 className="w-5 h-5 ml-1" />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-premium bg-bhumi-dark text-white hover:scale-105 px-10 !py-5 text-lg shadow-xl shadow-bhumi-dark/20">
                Get Started Now <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
              <Link to="/login" className="btn-premium bg-white/50 text-earth-900 border border-white/40 backdrop-blur-md px-10 !py-5 text-lg">
                View Demo
              </Link>
            </>
          )}
        </motion.div>
      </section>

      {/* 2. CORE CAPABILITIES - Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={ShieldCheck}
          title="Field Verification"
          desc="Proprietary AI filters and trust algorithms ensure data integrity across thousands of village data points."
          color="bg-bhumi-dark"
        />
        <FeatureCard
          icon={Cpu}
          title="Scheme Advisory"
          desc="Dynamic matching engine that analyzes farmer profiles against current government schemes in real-time."
          color="bg-saffron"
        />
        <FeatureCard
          icon={Globe}
          title="Multilingual AI"
          desc="Native language support for seamless interaction, removing technological barriers for ground-level impact."
          color="bg-bhumi-primary"
        />
      </section>

      {/* 3. IMPACT METRICS - Glass strip */}
      <section className="glass-card rounded-[40px] p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-bhumi-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          {[
            { label: 'Verified Villages', value: '1,200+' },
            { label: 'Active Farmers', value: '55K' },
            { label: 'Impact Score', value: '98%' },
            { label: 'Data Points', value: '2.4M' }
          ].map((stat, i) => (
            <div key={i} className="text-center lg:text-left">
              <div className="text-4xl font-black text-earth-900 mb-2 tracking-black">{stat.value}</div>
              <div className="text-xs font-black text-earth-800/40 uppercase tracking-[0.2em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
