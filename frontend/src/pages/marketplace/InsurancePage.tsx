import { motion } from 'framer-motion';
import { ShieldCheck, Umbrella, Star, Award } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface InsurancePlan {
    id: string;
    name: string;
    provider: string;
    premium: number;
    coverage: string;
    rating: number;
    reviews: number;
    image: string;
    description: string;
    category: 'Crop' | 'Livestock' | 'Health' | 'Weather';
    available: boolean;
}

const sampleInsurance: InsurancePlan[] = [
    {
        id: 'INS001',
        name: 'Pradhan Mantri Fasal Bima',
        provider: 'AIC of India',
        premium: 250,
        coverage: '₹50,000/Hectare',
        rating: 4.8,
        reviews: 1250,
        image: 'https://placehold.co/400x300/16a34a/white?text=Crop+Insurance',
        description: 'Government backed crop insurance scheme covering all food as well as oilseeds crops.',
        category: 'Crop',
        available: true,
    },
    {
        id: 'INS002',
        name: 'Cattle Protection Pro',
        provider: 'HDFC ERGO',
        premium: 1200,
        coverage: '₹80,000/Animal',
        rating: 4.6,
        reviews: 450,
        image: 'https://placehold.co/400x300/ea580c/white?text=Livestock+Insurance',
        description: 'Comprehensive coverage for cattle against death due to accidents or diseases.',
        category: 'Livestock',
        available: true,
    },
    {
        id: 'INS003',
        name: 'Kisan Swasthya Kavach',
        provider: 'Star Health',
        premium: 3500,
        coverage: '₹5,00,000/Family',
        rating: 4.7,
        reviews: 890,
        image: 'https://placehold.co/400x300/0891b2/white?text=Health+Insurance',
        description: 'Special health insurance plan designed for farmers and their family members.',
        category: 'Health',
        available: true,
    },
    {
        id: 'INS004',
        name: 'Weather Index-based Insurance',
        provider: 'ICICI Lombard',
        premium: 500,
        coverage: 'Yield Loss Basis',
        rating: 4.4,
        reviews: 320,
        image: 'https://placehold.co/400x300/7c3aed/white?text=Weather+Insurance',
        description: 'Covers crop loss due to adverse weather conditions like drought or heavy rain.',
        category: 'Weather',
        available: true,
    },
];

const InsuranceCard = ({ plan }: { plan: InsurancePlan }) => {
    const handleApply = () => {
        toast.success(`Application submitted for ${plan.name}! Our agent will contact you.`);
    };

    const categoryColors = {
        'Crop': 'bg-green-100 text-green-700',
        'Livestock': 'bg-orange-100 text-orange-700',
        'Health': 'bg-blue-100 text-blue-700',
        'Weather': 'bg-purple-100 text-purple-700',
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="glass-card rounded-3xl overflow-hidden group"
        >
            <div className="relative overflow-hidden bg-gray-100">
                <img
                    src={plan.image}
                    alt={plan.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-black ${categoryColors[plan.category]}`}>
                        {plan.category}
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <p className="text-xs font-bold text-bhumi-dark mb-1">{plan.provider}</p>
                        <h3 className="text-xl font-black text-earth-900">{plan.name}</h3>
                    </div>
                </div>

                <p className="text-sm text-earth-800/60 mb-4 line-clamp-2">{plan.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white/50 p-2 rounded-xl">
                        <p className="text-[10px] font-bold text-earth-800/40 uppercase tracking-wider">Premium</p>
                        <p className="text-sm font-black text-earth-900">₹{plan.premium}/yr</p>
                    </div>
                    <div className="bg-white/50 p-2 rounded-xl">
                        <p className="text-[10px] font-bold text-earth-800/40 uppercase tracking-wider">Coverage</p>
                        <p className="text-sm font-black text-green-600">{plan.coverage}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-earth-900">{plan.rating}</span>
                    </div>
                    <span className="text-xs text-earth-800/40">({plan.reviews} reviews)</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/40">
                    <button
                        onClick={handleApply}
                        className="w-full btn-premium py-3 flex items-center justify-center gap-2 bg-bhumi-dark text-white hover:bg-black"
                    >
                        <Umbrella className="w-4 h-4" />
                        Get Insured Now
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default function InsurancePage() {
    const [filter, setFilter] = useState<'all' | 'Crop' | 'Livestock' | 'Health' | 'Weather'>('all');

    const filteredPlans = sampleInsurance.filter((plan) => {
        if (filter === 'all') return true;
        return plan.category === filter;
    });

    return (
        <div className="space-y-12">
            <section className="text-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 mb-6"
                >
                    <div className="p-4 bg-bhumi-dark rounded-2xl shadow-xl">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-earth-900">
                        Agricultural <span className="text-bhumi-dark">Insurance</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-earth-800/60 font-medium"
                >
                    Stay protected against harvest failures, livestock loss, and health emergencies.
                </motion.p>
            </section>

            <section className="flex justify-center gap-4 flex-wrap">
                {[
                    { value: 'all', label: 'All Plans' },
                    { value: 'Crop', label: 'Crop' },
                    { value: 'Livestock', label: 'Livestock' },
                    { value: 'Health', label: 'Health' },
                    { value: 'Weather', label: 'Weather' },
                ].map((btn) => (
                    <button
                        key={btn.value}
                        onClick={() => setFilter(btn.value as any)}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all ${filter === btn.value
                            ? 'bg-bhumi-dark text-white shadow-lg'
                            : 'glass-card text-earth-900 hover:bg-white/60'
                            }`}
                    >
                        {btn.label}
                    </button>
                ))}
            </section>

            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPlans.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                    >
                        <InsuranceCard plan={plan} />
                    </motion.div>
                ))}
            </section>

            <section className="glass-card rounded-[40px] p-8 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <Award className="w-8 h-8 text-bhumi-dark mx-auto mb-2" />
                        <div className="text-3xl font-black text-earth-900">Secure</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Safe Transcations</div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-earth-900">Instant</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Quick Approval</div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-earth-900">Expert</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Advisory Support</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
