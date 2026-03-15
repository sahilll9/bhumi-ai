import { motion } from 'framer-motion';
import { Droplets, ShoppingCart, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '../../contexts/CartContext';
import { Plus, Minus } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    description: string;
    type: 'Drip' | 'Sprinkler' | 'Pump' | 'Accessories';
    inStock: boolean;
}

const sampleIrrigation: Product[] = [
    {
        id: 'I001',
        name: 'Drip Irrigation Kit - 1 Acre',
        brand: 'Jain Irrigation',
        price: 28000,
        rating: 4.8,
        reviews: 189,
        image: 'https://placehold.co/400x300/0891b2/white?text=Drip+Kit',
        description: 'Complete drip irrigation system for 1 acre with emitters, pipes, and fittings.',
        type: 'Drip',
        inStock: true,
    },
    {
        id: 'I002',
        name: 'Sprinkler System Set',
        brand: 'Netafim',
        price: 15000,
        rating: 4.6,
        reviews: 234,
        image: 'https://placehold.co/400x300/06b6d4/white?text=Sprinkler',
        description: 'Rotating sprinkler heads with adjustable spray pattern for uniform water distribution.',
        type: 'Sprinkler',
        inStock: true,
    },
    {
        id: 'I003',
        name: 'Submersible Water Pump 1HP',
        brand: 'Kirloskar',
        price: 12500,
        rating: 4.7,
        reviews: 456,
        image: 'https://placehold.co/400x300/3b82f6/white?text=Pump+1HP',
        description: 'Energy-efficient submersible pump with high discharge rate for deep borewells.',
        type: 'Pump',
        inStock: true,
    },
    {
        id: 'I004',
        name: 'Inline Drip Tubing 100m',
        brand: 'Rain Bird',
        price: 3200,
        rating: 4.5,
        reviews: 178,
        image: 'https://placehold.co/400x300/0284c7/white?text=Drip+Tubing',
        description: 'Pre-installed emitter drip tubing for efficient water delivery to plant roots.',
        type: 'Drip',
        inStock: true,
    },
    {
        id: 'I005',
        name: 'Centrifugal Pump 2HP',
        brand: 'Crompton',
        price: 8500,
        rating: 4.6,
        reviews: 267,
        image: 'https://placehold.co/400x300/7c3aed/white?text=Centrifugal',
        description: 'Surface-mounted centrifugal pump for shallow wells and water transfer.',
        type: 'Pump',
        inStock: false,
    },
    {
        id: 'I006',
        name: 'Micro Sprinkler Pack 50pcs',
        brand: 'Aqua Systems',
        price: 4800,
        rating: 4.4,
        reviews: 145,
        image: 'https://placehold.co/400x300/14b8a6/white?text=Micro+Sprinkler',
        description: 'Low-pressure micro sprinklers ideal for orchards and vegetable crops.',
        type: 'Sprinkler',
        inStock: true,
    },
    {
        id: 'I007',
        name: 'Irrigation Filter 2 inch',
        brand: 'Azud',
        price: 2200,
        rating: 4.7,
        reviews: 198,
        image: 'https://placehold.co/400x300/1e3a8a/white?text=Filter',
        description: 'Screen filter to remove impurities and prevent clogging in irrigation systems.',
        type: 'Accessories',
        inStock: true,
    },
    {
        id: 'I008',
        name: 'Solar Water Pump 3HP',
        brand: 'Shakti Pumps',
        price: 65000,
        rating: 4.9,
        reviews: 89,
        image: 'https://placehold.co/400x300/eab308/white?text=Solar+Pump',
        description: 'Eco-friendly solar-powered pump with no electricity costs, ideal for remote areas.',
        type: 'Pump',
        inStock: true,
    },
];

const ProductCard = ({ product }: { product: Product }) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            category: 'Irrigation'
        });
        toast.success(`${product.name} (${quantity}) added to cart!`);
    };

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    const typeColors = {
        Drip: 'bg-cyan-100 text-cyan-700',
        Sprinkler: 'bg-blue-100 text-blue-700',
        Pump: 'bg-purple-100 text-purple-700',
        Accessories: 'bg-gray-100 text-gray-700',
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="glass-card rounded-3xl overflow-hidden group"
        >
            <div className="relative overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-black ${typeColors[product.type]}`}>
                        {product.type}
                    </div>
                </div>
                {!product.inStock ? (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-black">
                        OUT OF STOCK
                    </div>
                ) : (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-green-600 text-white rounded-full text-xs font-black">
                        IN STOCK
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <p className="text-xs font-bold text-cyan-600 mb-1">{product.brand}</p>
                        <h3 className="text-xl font-black text-earth-900">{product.name}</h3>
                    </div>
                </div>

                <p className="text-sm text-earth-800/60 mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-earth-900">{product.rating}</span>
                    </div>
                    <span className="text-xs text-earth-800/40">({product.reviews} reviews)</span>
                </div>

                {/* Price, Quantity and Action */}
                <div className="space-y-4 pt-4 border-t border-white/40">
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-black text-earth-900">
                            ₹{product.price.toLocaleString('en-IN')}
                        </p>

                        {product.inStock && (
                            <div className="flex items-center gap-3 bg-white/50 px-3 py-1.5 rounded-xl border border-white/40">
                                <button onClick={decrement} className="p-1 hover:bg-white rounded-lg transition-colors">
                                    <Minus className="w-3 h-3 text-earth-900" />
                                </button>
                                <span className="w-4 text-center font-bold text-earth-900 text-sm">{quantity}</span>
                                <button onClick={increment} className="p-1 hover:bg-white rounded-lg transition-colors">
                                    <Plus className="w-3 h-3 text-earth-900" />
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        className={`w-full btn-premium py-3 flex items-center justify-center gap-2 ${product.inStock
                            ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {product.inStock ? 'Add to Cart' : 'Unavailable'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default function IrrigationPage() {
    const [filter, setFilter] = useState<'all' | 'Drip' | 'Sprinkler' | 'Pump' | 'Accessories'>('all');

    const filteredProducts = sampleIrrigation.filter((product) => {
        if (filter === 'all') return true;
        return product.type === filter;
    });

    return (
        <div className="space-y-12">
            <section className="text-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 mb-6"
                >
                    <div className="p-4 bg-cyan-600 rounded-2xl shadow-xl">
                        <Droplets className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-earth-900">
                        Irrigation <span className="text-cyan-600">Solutions</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-earth-800/60 font-medium"
                >
                    Modern irrigation systems for efficient water management and crop productivity
                </motion.p>
            </section>

            <section className="flex justify-center gap-4 flex-wrap">
                {[
                    { value: 'all', label: 'All Systems' },
                    { value: 'Drip', label: 'Drip Irrigation' },
                    { value: 'Sprinkler', label: 'Sprinklers' },
                    { value: 'Pump', label: 'Water Pumps' },
                    { value: 'Accessories', label: 'Accessories' },
                ].map((btn) => (
                    <button
                        key={btn.value}
                        onClick={() => setFilter(btn.value as any)}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all ${filter === btn.value
                            ? 'bg-cyan-600 text-white shadow-lg'
                            : 'glass-card text-earth-900 hover:bg-white/60'
                            }`}
                    >
                        {btn.label}
                    </button>
                ))}
            </section>

            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </section>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-xl text-earth-800/40 font-bold">No products found</p>
                </div>
            )}

            <section className="glass-card rounded-[40px] p-8">
                <div className="grid grid-cols-3 gap-8 text-center">
                    <div>
                        <Droplets className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                        <div className="text-3xl font-black text-earth-900">40%</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Water Savings</div>
                    </div>
                    <div>
                        <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-3xl font-black text-earth-900">30%</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Yield Increase</div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-earth-900">FREE</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Installation Guide</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
