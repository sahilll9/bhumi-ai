import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, IndianRupee, Clock, Key, Plus, ShieldCheck } from 'lucide-react';

interface Equipment {
    id: string;
    name: string;
    image: string;
    owner: string;
    location: string;
    distance: string;
    rating: number;
    pricePerDay: number;
    availableFrom: string;
    type: string;
}

const mockEquipment: Equipment[] = [
    { id: '1', name: 'Mahindra 575 DI Tractor', image: 'https://images.unsplash.com/photo-1592982537447-6b2bf0dbb88e?auto=format&fit=crop&q=80', owner: 'Ramesh Singh', location: 'Nashik District', distance: '4.2 km away', rating: 4.8, pricePerDay: 2500, availableFrom: 'Today', type: 'Tractor' },
    { id: '2', name: 'Swaraj Combined Harvester', image: 'https://images.unsplash.com/photo-1626084224749-fb507340e2fd?auto=format&fit=crop&q=80', owner: 'Patil Farms', location: 'Pune Rural', distance: '12 km away', rating: 4.9, pricePerDay: 8000, availableFrom: 'Tommorow', type: 'Harvester' },
    { id: '3', name: 'Honda Water Pump 5HP', image: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80', owner: 'Vijay Kumar', location: 'Nashik District', distance: '2.1 km away', rating: 4.5, pricePerDay: 400, availableFrom: 'Today', type: 'Pump' },
    { id: '4', name: 'Rotavator 6 Feet', image: 'https://images.unsplash.com/photo-1592982537447-6b2bf0dbb88e?auto=format&fit=crop&q=80', owner: 'Deshmukh Agro', location: 'Aurangabad', distance: '18 km away', rating: 4.7, pricePerDay: 1200, availableFrom: 'Next Week', type: 'Implement' }
];

export default function EquipmentRentalPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');

    const categories = ['All', 'Tractor', 'Harvester', 'Implement', 'Pump'];

    const filteredEquipment = mockEquipment.filter(eq =>
        (category === 'All' || eq.type === category) &&
        (eq.name.toLowerCase().includes(searchTerm.toLowerCase()) || eq.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-bhumi-dark text-white p-8 sm:p-12 mb-8 shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Key className="w-48 h-48" />
                </div>

                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 font-bold text-sm mb-6 border border-white/20 backdrop-blur-md">
                        <Key className="w-4 h-4" />
                        Peer-to-Peer Rentals
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
                        Rent Equipment <br />
                        <span className="text-yellow-400">Save up to 60%</span>
                    </h1>
                    <p className="text-lg text-white/80 font-medium max-w-xl mb-8">
                        Borrow heavy machinery from farmers nearby. Only pay for the days you use it. Secure, verified, and community-driven.
                    </p>

                    <div className="flex gap-4">
                        <button className="bg-yellow-400 text-bhumi-dark hover:bg-yellow-300 font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center gap-2">
                            <Search className="w-5 h-5" />
                            Find Equipment
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            List Yours
                        </button>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                    { icon: ShieldCheck, title: 'Verified Owners', desc: '100% KYC verified farmers' },
                    { icon: IndianRupee, title: 'Secure Payments', desc: 'Money held in escrow until rental completes' },
                    { icon: Star, title: 'Community Ratings', desc: 'Rent from top-rated neighbors' }
                ].map((Badge, i) => (
                    <div key={i} className="glass-card rounded-2xl p-4 flex items-center gap-4 border border-white/40 shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-bhumi-primary/10 flex items-center justify-center shrink-0">
                            <Badge.icon className="w-6 h-6 text-bhumi-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold text-earth-900">{Badge.title}</h4>
                            <p className="text-xs text-earth-800/60 font-medium">{Badge.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center glass-card p-4 rounded-2xl border border-white/40 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-800/40" />
                    <input
                        type="text"
                        placeholder="Search tractors, harvesters, districts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/50 border border-white/60 rounded-xl pl-12 pr-4 py-3 text-earth-900 font-medium focus:outline-none focus:ring-2 focus:ring-bhumi-primary/50 transition-all shadow-inner"
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                    {categories.map(c => (
                        <button
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`whitespace-nowrap px-4 py-2 rounded-xl font-bold text-sm transition-all ${category === c ? 'bg-bhumi-dark text-white shadow-md' : 'bg-white/50 text-earth-800/60 hover:bg-white border border-white/60'}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredEquipment.map((eq, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={eq.id}
                        className="glass-card rounded-3xl overflow-hidden border border-white/40 shadow-lg hover:shadow-xl transition-all group flex flex-col"
                    >
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={eq.image}
                                alt={eq.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs font-bold text-earth-900">{eq.rating}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-earth-900 leading-tight">{eq.name}</h3>
                            </div>

                            <div className="space-y-2 mb-4 flex-1">
                                <div className="flex items-center gap-1.5 text-xs text-earth-800/60 font-medium">
                                    <MapPin className="w-3.5 h-3.5" /> {eq.location} • {eq.distance}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-earth-800/60 font-medium">
                                    <Clock className="w-3.5 h-3.5" /> Available: <span className="text-green-600 font-bold">{eq.availableFrom}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-earth-900/10 flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-earth-800/50 font-bold uppercase tracking-wider mb-0.5">Rent per day</p>
                                    <p className="font-black text-xl text-bhumi-dark">
                                        ₹{eq.pricePerDay.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <button className="bg-bhumi-primary/10 hover:bg-bhumi-primary hover:text-white text-bhumi-dark font-bold px-4 py-2 rounded-xl transition-all text-sm">
                                    Book
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredEquipment.length === 0 && (
                <div className="glass-card rounded-3xl p-12 text-center border border-white/40 shadow-sm">
                    <Search className="w-12 h-12 text-earth-800/20 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-earth-900 mb-2">No equipment found</h3>
                    <p className="text-earth-800/60">Try adjusting your filters or search terms.</p>
                </div>
            )}

        </div>
    );
}
