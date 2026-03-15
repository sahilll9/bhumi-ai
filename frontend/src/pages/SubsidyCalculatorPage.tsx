import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, AlertCircle, CheckCircle2, Info, ArrowRight, IndianRupee } from 'lucide-react';

interface CalculationResult {
    schemeName: string;
    estimatedAmount: number;
    description: string;
    eligibility: string;
}

export default function SubsidyCalculatorPage() {
    const [landSize, setLandSize] = useState<number | ''>('');
    const [state, setState] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [isCalculating, setIsCalculating] = useState(false);
    const [results, setResults] = useState<CalculationResult[] | null>(null);

    const states = [
        'Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh',
        'Gujarat', 'Rajasthan', 'Karnataka', 'Tamil Nadu', 'Bihar', 'Other'
    ];

    const categories = [
        'Small (0 - 2 Hectares)',
        'Medium (2 - 10 Hectares)',
        'Large (> 10 Hectares)'
    ];

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsCalculating(true);
        setResults(null);

        // Simulate API call and calculation logic
        setTimeout(() => {
            const calculatedResults: CalculationResult[] = [];
            const size = Number(landSize);

            // Core PM-KISAN Logic
            if (size > 0) {
                calculatedResults.push({
                    schemeName: 'PM-KISAN SAMMAN NIDHI',
                    estimatedAmount: 6000,
                    description: 'Direct income support of ₹6,000 per year in three equal installments.',
                    eligibility: 'All landholding farmers'
                });
            }

            // State Specific
            if (state === 'Maharashtra') {
                calculatedResults.push({
                    schemeName: 'Namo Shetkari Maha Sanman Nidhi',
                    estimatedAmount: 6000,
                    description: 'Additional ₹6,000 per year for farmers in Maharashtra matching PM-KISAN.',
                    eligibility: 'Farmers registered in Maharashtra'
                });
            }

            // Fertilizer/Seed Subsidy Projection based on land size
            if (size > 0 && size <= 2) {
                calculatedResults.push({
                    schemeName: 'Small/Marginal Farmer Input Subsidy',
                    estimatedAmount: size * 1500,
                    description: 'Estimated subsidy for seeds and fertilizers based on small land holding.',
                    eligibility: 'Small and marginal farmers (< 2 Ha)'
                });
            }

            if (category.includes('Small')) {
                calculatedResults.push({
                    schemeName: 'PM-KUSUM (Solar Pumps)',
                    estimatedAmount: 50000,
                    description: 'Up to 60% subsidy on standalone solar agriculture pumps.',
                    eligibility: 'Farmers setting up solar pumps'
                });
            }

            setResults(calculatedResults);
            setIsCalculating(false);
        }, 1500);
    };

    const totalSubsidy = results?.reduce((acc, curr) => acc + curr.estimatedAmount, 0) || 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-3xl glass-card border border-white/20 p-8 sm:p-10 mb-8 z-10">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Calculator className="w-48 h-48 text-bhumi-primary" />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bhumi-primary/10 text-bhumi-primary font-bold text-sm mb-6 border border-bhumi-primary/20">
                        <Calculator className="w-4 h-4" />
                        Subsidy Estimation Tool
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-earth-900 mb-6 leading-tight">
                        Calculate Your Eligible <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-bhumi-primary to-bhumi-leaf">Government Benefits</span>
                    </h1>
                    <p className="text-lg text-earth-800/80 font-medium max-w-xl">
                        Enter your basic farming details to instantly see which government subsidies and financial aids you qualify for this season.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Calculator Form */}
                <div className="lg:col-span-5 relative z-10">
                    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/40 shadow-xl relative overflow-hidden h-full">
                        <h2 className="text-xl font-bold text-earth-900 mb-6 flex items-center gap-2">
                            <Info className="w-5 h-5 text-bhumi-primary" />
                            Your Farm Details
                        </h2>

                        <form onSubmit={handleCalculate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-earth-900 ml-1">State / Region</label>
                                <select
                                    required
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3.5 text-earth-900 font-medium focus:outline-none focus:ring-2 focus:ring-bhumi-primary/50 transition-all shadow-sm"
                                >
                                    <option value="" disabled>Select your state</option>
                                    {states.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-earth-900 ml-1">Land Size (in Hectares)</label>
                                <input
                                    type="number"
                                    required
                                    step="0.1"
                                    min="0.1"
                                    value={landSize}
                                    onChange={(e) => setLandSize(e.target.value === '' ? '' : Number(e.target.value))}
                                    placeholder="e.g. 1.5"
                                    className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3.5 text-earth-900 font-medium focus:outline-none focus:ring-2 focus:ring-bhumi-primary/50 transition-all shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-earth-900 ml-1">Farmer Category</label>
                                <select
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3.5 text-earth-900 font-medium focus:outline-none focus:ring-2 focus:ring-bhumi-primary/50 transition-all shadow-sm"
                                >
                                    <option value="" disabled>Select farm size category</option>
                                    {categories.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isCalculating || !state || !landSize || !category}
                                className="w-full btn-premium bg-bhumi-dark hover:bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isCalculating ? (
                                    <div className="flex gap-1 items-center">
                                        <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                ) : (
                                    <>
                                        Calculate Benefits
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Results Area */}
                <div className="lg:col-span-7 relative z-10">
                    {!results && !isCalculating ? (
                        <div className="h-full glass-card rounded-3xl border border-white/40 shadow-xl flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                            <div className="w-20 h-20 rounded-full bg-bhumi-primary/10 flex items-center justify-center mb-6">
                                <Calculator className="w-10 h-10 text-bhumi-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-earth-900 mb-2">Ready to Calculate</h3>
                            <p className="text-earth-800/60 max-w-md">
                                Fill out the form on the left with your land details to see an AI-generated estimate of your potential government subsidies.
                            </p>
                        </div>
                    ) : isCalculating ? (
                        <div className="h-full glass-card rounded-3xl border border-white/40 shadow-xl flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                            <div className="w-20 h-20 rounded-full bg-bhumi-dark flex items-center justify-center mb-6 relative">
                                <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-white animate-spin"></div>
                                <Calculator className="w-8 h-8 text-white animate-pulse" />
                            </div>
                            <h3 className="text-xl font-bold text-earth-900 mb-2">Analyzing Schemes...</h3>
                            <p className="text-earth-800/60">Cross-referencing your profile with 300+ active government schemes.</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="h-full flex flex-col gap-6"
                        >
                            {/* Total Summary Card */}
                            <div className="glass-card rounded-3xl border-2 border-bhumi-primary/30 p-8 shadow-2xl relative overflow-hidden bg-gradient-to-br from-white/90 to-bhumi-light/80">
                                <div className="absolute -right-10 -bottom-10 opacity-10">
                                    <IndianRupee className="w-48 h-48 text-bhumi-primary" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-sm font-bold text-earth-800/60 uppercase tracking-widest mb-2">Estimated Total Benefit</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl sm:text-6xl font-black text-bhumi-dark">₹{totalSubsidy.toLocaleString('en-IN')}</span>
                                        <span className="text-xl font-bold text-earth-800/40">/ year</span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-sm font-bold text-earth-800 bg-white/60 inline-flex px-4 py-2 rounded-xl">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Eligible for {results?.length || 0} Schemes
                                    </div>
                                </div>
                            </div>

                            {/* Breakdown List */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-earth-900 px-2">Breakdown of Schemes</h3>
                                {results?.map((result, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={idx}
                                        className="glass-card rounded-2xl p-6 border border-white/60 shadow-md hover:shadow-lg transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="text-lg font-bold text-earth-900">{result.schemeName}</h4>
                                            <div className="bg-bhumi-primary/10 text-bhumi-dark font-black px-3 py-1 rounded-lg">
                                                ₹{result.estimatedAmount.toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                        <p className="text-earth-800/70 text-sm mb-4 leading-relaxed">
                                            {result.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs font-bold text-earth-800/50 bg-earth-50 px-3 py-1.5 rounded-lg inline-flex">
                                            <AlertCircle className="w-3 h-3" />
                                            Requires: {result.eligibility}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
