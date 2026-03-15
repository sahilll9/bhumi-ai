import { motion } from 'framer-motion';
import { CreditCard, IndianRupee, TrendingDown, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

/**
 * ============================================================================
 * AGRICULTURAL LOAN SERVICES - RED THEME
 * ============================================================================
 * Financial assistance and loan options for farmers
 * ============================================================================
 */

interface LoanScheme {
    id: string;
    name: string;
    provider: string;
    interestRate: number;
    maxAmount: number;
    tenure: string;
    description: string;
    features: string[];
    processingFee: string;
    category: 'Government' | 'Bank' | 'Microfinance';
    popular: boolean;
}

const loanSchemes: LoanScheme[] = [
    {
        id: 'L001',
        name: 'Kisan Credit Card (KCC)',
        provider: 'Government of India',
        interestRate: 7.0,
        maxAmount: 300000,
        tenure: 'Up to 5 years',
        description: 'Subsidized credit for cultivation and allied activities with flexible repayment.',
        features: [
            'Interest subvention of 3%',
            'No collateral up to ₹1.6 lakh',
            'Insurance coverage included',
            'Simple documentation'
        ],
        processingFee: 'Nil',
        category: 'Government',
        popular: true,
    },
    {
        id: 'L002',
        name: 'Agriculture Term Loan',
        provider: 'State Bank of India',
        interestRate: 8.5,
        maxAmount: 2000000,
        tenure: 'Up to 7 years',
        description: 'Long-term loan for purchase of farm equipment, land development, and irrigation.',
        features: [
            'Competitive interest rates',
            'Flexible repayment options',
            'Quick processing',
            'Loan up to ₹20 lakhs'
        ],
        processingFee: '0.5% + GST',
        category: 'Bank',
        popular: true,
    },
    {
        id: 'L003',
        name: 'Crop Production Loan',
        provider: 'HDFC Bank',
        interestRate: 9.0,
        maxAmount: 500000,
        tenure: '6-18 months',
        description: 'Short-term loan for crop cultivation, seeds, fertilizers, and farming operations.',
        features: [
            'Season-based repayment',
            'Easy eligibility criteria',
            'Digital application process',
            'Doorstep service'
        ],
        processingFee: '1% + GST',
        category: 'Bank',
        popular: false,
    },
    {
        id: 'L004',
        name: 'Dairy Farming Loan',
        provider: 'NABARD',
        interestRate: 7.5,
        maxAmount: 1000000,
        tenure: 'Up to 5 years',
        description: 'Financial support for dairy farming, cattle purchase, and dairy equipment.',
        features: [
            'Subsidy schemes available',
            'Covers working capital',
            'Low interest rate',
            'Government backed'
        ],
        processingFee: 'Nominal',
        category: 'Government',
        popular: true,
    },
    {
        id: 'L005',
        name: 'Micro Irrigation Loan',
        provider: 'ICICI Bank',
        interestRate: 8.75,
        maxAmount: 750000,
        tenure: 'Up to 5 years',
        description: 'Dedicated loan for drip and sprinkler irrigation system installation.',
        features: [
            'Covers 100% equipment cost',
            'Subsidies linked',
            'Fast approval',
            'Expert consultation'
        ],
        processingFee: '0.75% + GST',
        category: 'Bank',
        popular: false,
    },
    {
        id: 'L006',
        name: 'Small Farmer Finance',
        provider: 'Bandhan Bank',
        interestRate: 10.5,
        maxAmount: 100000,
        tenure: '1-3 years',
        description: 'Microfinance solution for small and marginal farmers with minimal documentation.',
        features: [
            'No collateral required',
            'Quick disbursal',
            'Doorstep assistance',
            'Flexible EMI'
        ],
        processingFee: '2%',
        category: 'Microfinance',
        popular: false,
    },
];

const LoanCard = ({ loan }: { loan: LoanScheme }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleApply = () => {
        toast.success(`Application initiated for ${loan.name}!`);
    };

    const categoryColors = {
        Government: 'bg-green-100 text-green-700 border-green-300',
        Bank: 'bg-blue-100 text-blue-700 border-blue-300',
        Microfinance: 'bg-purple-100 text-purple-700 border-purple-300',
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="glass-card rounded-3xl overflow-hidden group border-2 border-red-100"
        >
            <div className="p-6 bg-gradient-to-br from-red-50 to-white">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-2xl font-black text-red-700">{loan.name}</h3>
                            {loan.popular && (
                                <span className="px-2 py-1 bg-red-600 text-white rounded-lg text-[10px] font-black">
                                    POPULAR
                                </span>
                            )}
                        </div>
                        <p className="text-sm font-bold text-red-600">{loan.provider}</p>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-black mt-2 border ${categoryColors[loan.category]}`}>
                            {loan.category}
                        </div>
                    </div>
                    <div className="p-3 bg-red-600 rounded-xl">
                        <CreditCard className="w-6 h-6 text-white" />
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-white/60 rounded-2xl">
                    <div>
                        <div className="flex items-center gap-1 text-red-600 mb-1">
                            <TrendingDown className="w-4 h-4" />
                            <span className="text-xs font-bold">Interest Rate</span>
                        </div>
                        <p className="text-2xl font-black text-earth-900">{loan.interestRate}%</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-1 text-red-600 mb-1">
                            <IndianRupee className="w-4 h-4" />
                            <span className="text-xs font-bold">Max Amount</span>
                        </div>
                        <p className="text-2xl font-black text-earth-900">
                            ₹{(loan.maxAmount / 100000).toFixed(1)}L
                        </p>
                    </div>
                    <div className="col-span-2">
                        <div className="flex items-center gap-1 text-red-600 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-bold">Tenure</span>
                        </div>
                        <p className="text-lg font-black text-earth-900">{loan.tenure}</p>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-earth-800/70 mb-4 line-clamp-2">
                    {loan.description}
                </p>

                {/* Features */}
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-4 space-y-2"
                    >
                        {loan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-earth-800/80">{feature}</span>
                            </div>
                        ))}
                        <div className="flex items-center gap-2 pt-2 mt-2 border-t border-red-100">
                            <ShieldCheck className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-bold text-earth-900">
                                Processing Fee: <span className="text-red-600">{loan.processingFee}</span>
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex-1 py-3 px-4 bg-white border-2 border-red-200 rounded-xl font-bold text-red-700 hover:bg-red-50 transition-colors"
                    >
                        {isExpanded ? 'Show Less' : 'View Details'}
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 btn-premium py-3 px-4 bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30"
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default function LoanPage() {
    const [filter, setFilter] = useState<'all' | 'Government' | 'Bank' | 'Microfinance'>('all');

    const filteredLoans = loanSchemes.filter((loan) => {
        if (filter === 'all') return true;
        return loan.category === filter;
    });

    return (
        <div className="space-y-12">
            {/* Header with Red Theme */}
            <section className="text-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 mb-6"
                >
                    <div className="p-4 bg-red-600 rounded-2xl shadow-xl shadow-red-600/30">
                        <CreditCard className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-earth-900">
                        Agricultural <span className="text-red-600">Loans</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-earth-800/60 font-medium"
                >
                    Access affordable credit facilities tailored for farming and allied activities
                </motion.p>

                {/* Special Alert */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl inline-block"
                >
                    <p className="text-sm font-black text-red-700">
                        🔥 Special Interest Rates Available for KCC Holders - Apply Today!
                    </p>
                </motion.div>
            </section>

            {/* Filters */}
            <section className="flex justify-center gap-4 flex-wrap">
                {[
                    { value: 'all', label: 'All Schemes' },
                    { value: 'Government', label: 'Government' },
                    { value: 'Bank', label: 'Bank Loans' },
                    { value: 'Microfinance', label: 'Microfinance' },
                ].map((btn) => (
                    <button
                        key={btn.value}
                        onClick={() => setFilter(btn.value as any)}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all ${filter === btn.value
                                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                                : 'glass-card text-earth-900 hover:bg-white/60'
                            }`}
                    >
                        {btn.label}
                    </button>
                ))}
            </section>

            {/* Loan Cards Grid */}
            <section className="grid md:grid-cols-2 gap-8">
                {filteredLoans.map((loan, index) => (
                    <motion.div
                        key={loan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                    >
                        <LoanCard loan={loan} />
                    </motion.div>
                ))}
            </section>

            {filteredLoans.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-xl text-earth-800/40 font-bold">No loan schemes found</p>
                </div>
            )}

            {/* Stats Banner - Red Theme */}
            <section className="glass-card rounded-[40px] p-8 bg-gradient-to-br from-red-50 to-white border-2 border-red-100">
                <div className="grid grid-cols-3 gap-8 text-center">
                    <div>
                        <IndianRupee className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <div className="text-3xl font-black text-earth-900">₹500Cr+</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Loans Disbursed</div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-earth-900">10K+</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Happy Farmers</div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-earth-900">7 Days</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Avg. Approval Time</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
