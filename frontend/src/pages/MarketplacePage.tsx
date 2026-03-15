import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tractor, Sprout, Wrench, Droplets, CreditCard, ChevronRight, ShieldCheck, Key } from 'lucide-react';

/**
 * ============================================================================
 * MARKETPLACE HUB
 * ============================================================================
 * Central marketplace for agricultural resources and financial services
 * ============================================================================
 */

interface CategoryCardProps {
    icon: any;
    title: string;
    description: string;
    path: string;
    color: string;
    badge?: string;
    badgeColor?: string;
}

const CategoryCard = ({ icon: Icon, title, description, path, color, badge, badgeColor }: CategoryCardProps) => (
    <Link to={path}>
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card p-8 rounded-3xl group cursor-pointer relative overflow-hidden"
        >
            {/* Badge for special items */}
            {badge && (
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black ${badgeColor}`}>
                    {badge}
                </div>
            )}

            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all shadow-lg ${color} group-hover:scale-110`}>
                <Icon className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-black text-earth-900 mb-3 group-hover:text-bhumi-dark transition-colors">
                {title}
            </h3>

            <p className="text-earth-800/60 leading-relaxed mb-6 font-medium">
                {description}
            </p>

            <div className="flex items-center text-sm font-bold tracking-tight text-bhumi-dark opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                BROWSE CATALOG <ChevronRight className="w-4 h-4 ml-1" />
            </div>
        </motion.div>
    </Link>
);

export default function MarketplacePage() {
    const categories = [
        {
            icon: Tractor,
            title: 'Machinery',
            description: 'Modern agricultural machinery and farming equipment to boost productivity and efficiency.',
            path: '/marketplace/machinery',
            color: 'bg-blue-600',
        },
        {
            icon: Sprout,
            title: 'Fertilizer',
            description: 'Premium organic and chemical fertilizers for optimal crop growth and soil health.',
            path: '/marketplace/fertilizer',
            color: 'bg-green-600',
        },
        {
            icon: Wrench,
            title: 'Equipment',
            description: 'Essential farming tools, implements, and equipment for daily agricultural operations.',
            path: '/marketplace/equipment',
            color: 'bg-orange-600',
        },
        {
            icon: Droplets,
            title: 'Irrigation',
            description: 'Modern irrigation systems including drip, sprinkler, and smart water management solutions.',
            path: '/marketplace/irrigation',
            color: 'bg-cyan-600',
        },
        {
            icon: CreditCard,
            title: 'Loan Services',
            description: 'Agricultural loans, credit facilities, and financial assistance for farmers at competitive rates.',
            path: '/marketplace/loan',
            color: 'bg-red-600',
            badge: 'HOT',
            badgeColor: 'bg-red-100 text-red-600',
        },
        {
            icon: Key,
            title: 'Equipment Rentals',
            description: 'Peer-to-peer equipment rentals. Borrow tractors, harvesters, and tools from verified farmers nearby.',
            path: '/marketplace/rentals',
            color: 'bg-yellow-600',
            badge: 'NEW',
            badgeColor: 'bg-yellow-100 text-yellow-600',
        },
        {
            icon: ShieldCheck,
            title: 'Insurance',
            description: 'Protect your crops, livestock, and health with customized agricultural insurance plans.',
            path: '/marketplace/insurance',
            color: 'bg-indigo-600',
        },
    ];

    return (
        <div className="space-y-16">
            {/* Header Section */}
            <section className="text-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bhumi-primary/10 border border-bhumi-primary/20 text-bhumi-dark text-xs font-black tracking-widest mb-8"
                >
                    🛒 AGRICULTURAL MARKETPLACE
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black text-earth-900 leading-[1.1] tracking-tighter mb-6"
                >
                    One-Stop <span className="text-transparent bg-clip-text bg-gradient-to-r from-bhumi-dark via-bhumi-deep to-bhumi-primary">Agricultural Hub</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-earth-800/60 font-medium max-w-2xl mx-auto leading-relaxed"
                >
                    Access quality agricultural resources, modern equipment, and financial services tailored for the farming community.
                </motion.p>
            </section>

            {/* Categories Grid */}
            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category, index) => (
                    <motion.div
                        key={category.path}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <CategoryCard {...category} />
                    </motion.div>
                ))}
            </section>

            {/* Stats Section */}
            <section className="glass-card rounded-[40px] p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-bhumi-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                    {[
                        { label: 'Products Available', value: '500+' },
                        { label: 'Verified Sellers', value: '120' },
                        { label: 'Happy Customers', value: '2.5K' },
                        { label: 'Loans Disbursed', value: '₹12Cr' }
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
