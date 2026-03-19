import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    ChevronLeft,
    Target,
    AlertCircle,
    Globe,
    Zap,
    ShieldCheck,
    Calculator,
    MessageSquare,
    Mic,
    Monitor,
    CheckCircle2
} from 'lucide-react';

const slides = [
    {
        id: 'intro',
        title: 'BHUMI AI',
        subtitle: 'Bridging the Gap Between Government Schemes and 150 Million Farmers',
        content: [
            'AI-Powered | Multilingual | Voice-First',
            'Built for Bharat, Not Just India'
        ],
        icon: <Globe className="w-16 h-16 text-earth-600" />,
        color: 'from-earth-500/20 to-green-500/20'
    },
    {
        id: 'problem',
        title: 'Deep Problem Analysis 🔴',
        subtitle: (
            <span>
                The "Last Mile" Connection Crisis: Why <span className="text-red-600 font-extrabold animate-pulse">₹15,000+ Cr</span> Stays Unclaimed
            </span>
        ),
        details: [
            { title: 'The UI/Literacy Barrier', desc: 'Government portals are desktop-first & English-centric. Farmers are mobile-only and speak 10+ regional dialects.', icon: <AlertCircle /> },
            { title: 'The Trust/Middleman Gap', desc: 'Agents take 20-30% cuts from every subsidy installment. We eliminate this "Tax on the Poor" via direct transparency.', icon: <MessageSquare /> },
            { title: 'The Verification Bottleneck', desc: '60% of officer time is wasted on manual paper checks. This causes a 3-6 month approval lag during sowing seasons.', icon: <Monitor /> },
            { title: 'The Personalization Failure', desc: 'generic SMS broadcasts fail 150M farmers who need plot-specific advisory based on soil and local weather.', icon: <ShieldCheck /> }
        ],
        highlight: '"We aren\'t just solving a registration problem; we are solving a systemic infrastructure collapse in rural India."',
        color: 'from-red-600/20 to-orange-600/10'
    },
    {
        id: 'solution',
        title: 'The Bhumi AI Bridge 🟢',
        subtitle: 'Connecting Identity, Assets, and Intelligence.',
        features_detailed: [
            { name: 'Multi-Dialect Voice AI', solving: 'UI Friction', impact: '100% Accessibility for low-literacy users.', icon: <Mic /> },
            { name: 'AI Vision Doc Verifier', solving: 'Approval Lag', impact: 'Reduces verification from 3 months to 3 seconds.', icon: <ShieldCheck /> },
            { name: 'Personalized Advisor', solving: 'Info Overload', impact: 'Curated Recs based on actual GPS land records.', icon: <MessageSquare /> },
            { name: 'Entitlement Transparency', solving: 'Exploitation', impact: 'Kills the Middleman economy through direct data.', icon: <Calculator /> }
        ],
        transformation: [
            { before: '3-Month Wait for Approval', after: 'Instant AI Verification' },
            { before: '20% Middleman "Tax"', after: '₹0 Platform Trust' },
            { before: 'Complex English Portals', after: 'Conversational Voice AI' }
        ],
        color: 'from-green-500/10 to-emerald-500/10'
    },
    {
        id: 'opportunity',
        title: 'The Massive Opportunity 📊',
        subtitle: 'Capturing the $24B Agri-Tech Frontier',
        stats: [
            { label: 'Total Farmers', value: '150M+' },
            { label: 'Scheme Budget', value: '₹2.5L Cr' },
            { label: 'Marketplace Potential', value: '$8B' },
            { label: 'Ins/Loan Payouts', value: '₹30K Cr' }
        ],
        market_details: [
            'India Stack is ready (UPI, Aadhaar, DigiLocker)',
            'Smartphone penetration in rural areas > 65%',
            'Government mandate for 100% digital subsidy distribution',
            'Zero dominant player in AI-led rural advisory'
        ],
        color: 'from-blue-500/10 to-indigo-500/10'
    },
    {
        id: 'usp',
        title: 'Why Bhumi AI Wins 💎',
        subtitle: 'The 10x Advantage built for Bharat',
        comparison: [
            { feature: 'Voice-First UX', bhumi: true, others: false },
            { feature: 'AI Vision Fraud Detection', bhumi: true, others: false },
            { feature: 'Groq LPU (Sub-500ms AI)', bhumi: true, others: false },
            { feature: 'Hindi Virtual Keyboard', bhumi: true, others: false },
            { feature: 'GPS-to-Scheme Mapping', bhumi: true, others: false }
        ],
        color: 'from-yellow-400/20 to-purple-500/10'
    },
    {
        id: 'model',
        title: 'Scalable Revenue Model 💵',
        subtitle: 'Diversified & High-Margin Streams',
        streams: [
            { name: 'Marketplace Comm.', value: '5-8%', detail: 'Seeds, Machinery, Fertilizer' },
            { name: 'Premium Advisory', value: '₹99/mo', detail: 'Hyper-local weather & pricing' },
            { name: 'B2G Licensing', value: 'SaaS', detail: 'State Govt. Dashboards' },
            { name: 'Financial Leads', value: 'Success Fee', detail: 'Loans & Crop Insurance' }
        ],
        projection: 'Target: ₹50 Crore ARR in Year 1 | LTV:CAC = 24x',
        color: 'from-earth-500/10 to-green-500/10'
    },
    {
        id: 'traction',
        title: 'Traction & Vision 🚀',
        subtitle: 'Ready to Scale to 150M Farmers',
        milestones: [
            '✅ Full-stack AI platform built (15+ pages)',
            '✅ 4-language Voice AI integration live',
            '✅ Groq LPU Powered (Ultra-fast inference)',
            '🚀 Launching Pilot with 3 State Govts.'
        ],
        color: 'from-orange-500/10 to-red-500/10'
    },
    {
        id: 'ask',
        title: 'The Ask 🙏',
        subtitle: 'Seeking ₹2 Crore Seed Funding',
        allocation: [
            { label: 'Mobile App Exp.', value: '40%' },
            { label: 'GTM & Field Ops', value: '30%' },
            { label: 'Engineering Team', value: '20%' },
            { label: 'AI Compute LPU', value: '10%' }
        ],
        color: 'from-earth-500/10 to-green-500/10'
    }
];

export default function PitchDeckPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setDirection(1);
            setCurrentSlide(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setDirection(-1);
            setCurrentSlide(prev => prev - 1);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide]);

    const slide = slides[currentSlide];

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <div className="min-h-screen bg-earth-50 overflow-hidden relative pt-16">
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} transition-colors duration-1000`} />

            {/* Solid Premium "Notch" Navigation */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 px-8 py-4 bg-white/60 backdrop-blur-2xl border border-white/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-4">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > currentSlide ? 1 : -1);
                            setCurrentSlide(idx);
                        }}
                        className={`h-3 rounded-full transition-all duration-700 ease-out ${idx === currentSlide
                            ? 'w-12 bg-earth-900 shadow-[0_0_15px_rgba(31,41,23,0.4)]'
                            : 'w-3 bg-earth-200 hover:bg-earth-300'
                            }`}
                        title={`Go to Slide ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Main Content Area - Scaled Up */}
            <div className="relative z-10 container mx-auto px-8 h-[calc(100vh-8rem)] flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentSlide}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 200, damping: 25 },
                            opacity: { duration: 0.3 }
                        }}
                        className="w-full max-w-7xl"
                    >
                        <div className="glass-card p-16 rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.1)] border-white/40 relative overflow-hidden bg-white/80">
                            <div className="flex flex-col md:flex-row items-center gap-16">
                                <div className="flex-[1.5]">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <span className="text-earth-600 font-black tracking-[0.3em] uppercase text-xl mb-6 block">
                                            Slide {currentSlide + 1} of {slides.length}
                                        </span>
                                        <h1 className="text-7xl md:text-9xl font-black text-earth-900 mb-8 leading-[0.9] tracking-tighter">
                                            {slide.title}
                                        </h1>
                                        <p className="text-4xl text-earth-700 mb-12 font-bold leading-tight max-w-3xl">
                                            {slide.subtitle}
                                        </p>

                                        {/* Dynamic Content Rendering based on slide type */}
                                        {slide.id === 'intro' && (
                                            <div className="space-y-4">
                                                {slide.content?.map((text, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-xl text-earth-700">
                                                        <Zap className="text-earth-500" />
                                                        {text}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {slide.details && (
                                            <div className="grid grid-cols-1 gap-8">
                                                {slide.details.map((d, i) => (
                                                    <div key={i} className="flex gap-8 p-8 bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/40 shadow-sm hover:shadow-xl hover:bg-white/90 transition-all duration-500 group">
                                                        <div className="text-earth-600 flex-shrink-0 scale-[1.8] mt-2 group-hover:scale-[2] transition-transform">{d.icon}</div>
                                                        <div className="pl-4">
                                                            <div className="font-black text-earth-900 text-3xl mb-2">{d.title}</div>
                                                            <div className="text-2xl text-earth-700 leading-relaxed font-medium">{d.desc}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {slide.features_detailed && (
                                            <div className="grid grid-cols-2 gap-8">
                                                {slide.features_detailed.map((f, i) => (
                                                    <div key={i} className="bg-white/60 p-8 rounded-[2.5rem] border border-white/40 shadow-sm hover:bg-white/90 transition-all duration-500">
                                                        <div className="text-earth-700 mb-6 scale-[2] origin-left">{f.icon}</div>
                                                        <h3 className="font-black text-earth-900 text-3xl mb-3">{f.name}</h3>
                                                        <div className="text-sm font-black text-red-600 uppercase tracking-widest mb-4 bg-red-100 px-3 py-1 rounded-full w-fit">Solves: {f.solving}</div>
                                                        <p className="text-2xl text-earth-700 font-medium leading-relaxed">{f.impact}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {slide.stats && (
                                            <div className="grid grid-cols-2 gap-8">
                                                {slide.stats.map((s, i) => (
                                                    <div key={i} className="bg-white/60 p-10 rounded-[2.5rem] border border-white/40 text-center shadow-sm hover:shadow-xl transition-all duration-500">
                                                        <div className="text-7xl font-black text-earth-900 mb-2">{s.value}</div>
                                                        <div className="text-xl font-black text-earth-500 uppercase tracking-[0.2em]">{s.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {slide.market_details && (
                                            <div className="grid grid-cols-1 gap-6 mt-6">
                                                {slide.market_details.map((m, i) => (
                                                    <div key={i} className="flex items-center gap-6 text-3xl text-earth-800 font-bold">
                                                        <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                                                        {m}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {slide.projection && (
                                            <div className="mt-6 p-4 bg-earth-900 rounded-xl text-white text-center font-bold">
                                                {slide.projection}
                                            </div>
                                        )}

                                        {slide.transformation && (
                                            <div className="mt-10 p-8 bg-white/40 rounded-3xl border border-white/60 backdrop-blur-lg">
                                                <div className="text-xs font-black text-earth-500 uppercase tracking-widest text-center mb-6">Execution Strategy</div>
                                                <div className="space-y-4">
                                                    {slide.transformation.map((t: any, i: number) => (
                                                        <div key={i} className="flex items-center justify-between text-lg font-bold">
                                                            <span className="text-red-500/60 line-through decoration-2">{t.before}</span>
                                                            <div className="flex-1 border-b-2 border-dashed border-earth-300 mx-6 opacity-30" />
                                                            <span className="text-green-700">{t.after}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {"stats" in slide && slide.stats && (
                                            <div className="grid grid-cols-2 gap-4">
                                                {(slide.stats as any[]).map((s, i) => (
                                                    <div key={i} className="bg-white/50 p-6 rounded-2xl border border-white/20 text-center">
                                                        <div className="text-4xl font-black text-earth-900 mb-1">{s.value}</div>
                                                        <div className="text-sm font-bold text-earth-500 uppercase tracking-tighter">{s.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {"stack" in slide && slide.stack && (
                                            <div className="space-y-4">
                                                {(slide.stack as any[]).map((s, i) => (
                                                    <div key={i} className="bg-white/40 p-4 rounded-xl flex justify-between items-center">
                                                        <span className="font-bold text-earth-500">{s.category}</span>
                                                        <span className="font-medium text-earth-900">{s.items}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {"comparison" in slide && slide.comparison && (
                                            <div className="space-y-3">
                                                {(slide.comparison as any[]).map((c, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 border-b border-earth-100 last:border-0">
                                                        <span className="font-medium text-earth-800">{c.feature}</span>
                                                        <div className="flex gap-4">
                                                            <span className="text-xs font-bold text-earth-400">Others ❌</span>
                                                            <span className="text-xs font-bold text-green-600">Bhumi AI ✅</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {"streams" in slide && slide.streams && (
                                            <div className="grid grid-cols-2 gap-2">
                                                {(slide.streams as any[]).map((s, i) => (
                                                    <div key={i} className="bg-earth-900/5 p-3 rounded-xl">
                                                        <div className="text-[10px] font-bold text-earth-500 mb-0.5">{s.name}</div>
                                                        <div className="text-sm font-black text-earth-900">{s.value}</div>
                                                        <div className="text-[8px] text-earth-600">{s.detail}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {"milestones" in slide && slide.milestones && (
                                            <div className="space-y-3">
                                                {(slide.milestones as any[]).map((m, i) => (
                                                    <div key={i} className="text-lg font-bold text-earth-800 flex items-center gap-3">
                                                        {m}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {"allocation" in slide && slide.allocation && (
                                            <div className="space-y-4">
                                                {(slide.allocation as any[]).map((a, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <div className="flex justify-between text-sm font-bold">
                                                            <span>{a.label}</span>
                                                            <span className="text-earth-600">{a.value}</span>
                                                        </div>
                                                        <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: a.value }}
                                                                transition={{ delay: 0.5, duration: 1 }}
                                                                className="h-full bg-earth-600"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                </div>

                                <div className="hidden md:flex flex-1 justify-center items-center">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                        transition={{ delay: 0.3, type: "spring" }}
                                        className="relative"
                                    >
                                        <div className="relative z-10 w-64 h-64 bg-white/80 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                                            {slide.icon || <Target className="w-16 h-16 text-earth-600" />}
                                        </div>
                                        {/* Decorative Blobs */}
                                        <div className="absolute -top-4 -left-4 w-32 h-32 bg-green-400/20 blur-3xl animate-pulse rounded-full" />
                                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-earth-400/20 blur-3xl animate-pulse rounded-full" />
                                    </motion.div>
                                </div>
                            </div>

                            {slide.highlight && (
                                <div className="mt-12 p-6 bg-earth-900 rounded-2xl text-white italic text-center text-lg font-medium">
                                    {slide.highlight}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Controls */}
            <div className="absolute bottom-10 left-0 right-0 z-20 container mx-auto px-6 flex justify-between items-center">
                <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-lg text-earth-600 font-bold disabled:opacity-50 hover:bg-earth-50 transition-colors"
                >
                    <ChevronLeft /> Previous
                </button>

                <div className="text-earth-500 font-bold text-sm">
                    Press ARROW KEYS to navigate
                </div>

                <button
                    onClick={nextSlide}
                    disabled={currentSlide === slides.length - 1}
                    className="flex items-center gap-2 px-8 py-3 rounded-full bg-earth-900 text-white shadow-xl font-bold disabled:opacity-50 hover:bg-earth-800 transition-colors"
                >
                    {currentSlide === slides.length - 1 ? 'End' : 'Continue'} <ChevronRight />
                </button>
            </div>
        </div>
    );
}
