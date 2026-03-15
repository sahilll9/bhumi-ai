import { motion } from 'framer-motion';
import { Wrench, ShoppingCart, Star, Award } from 'lucide-react';
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
    category: 'Hand Tools' | 'Power Tools' | 'Accessories';
    inStock: boolean;
}

const sampleEquipment: Product[] = [
    {
        id: 'E001',
        name: 'Garden Hoe Premium',
        brand: 'Fiskars',
        price: 850,
        rating: 4.6,
        reviews: 178,
        image: 'https://placehold.co/400x300/ea580c/white?text=Garden+Hoe',
        description: 'Durable steel garden hoe with ergonomic wooden handle for efficient weeding.',
        category: 'Hand Tools',
        inStock: true,
    },
    {
        id: 'E002',
        name: 'Pruning Shears Professional',
        brand: 'Gardena',
        price: 1200,
        rating: 4.8,
        reviews: 256,
        image: 'https://placehold.co/400x300/16a34a/white?text=Pruning+Shears',
        description: 'High-carbon steel blades with bypass cutting design for clean, precise cuts.',
        category: 'Hand Tools',
        inStock: true,
    },
    {
        id: 'E003',
        name: 'Electric Sprayer 16L',
        brand: 'Kisankraft',
        price: 4500,
        rating: 4.5,
        reviews: 134,
        image: 'https://placehold.co/400x300/0891b2/white?text=Sprayer',
        description: 'Battery-powered sprayer with adjustable nozzle for pesticides and fertilizers.',
        category: 'Power Tools',
        inStock: true,
    },
    {
        id: 'E004',
        name: 'Chaff Cutter Manual',
        brand: 'Agri-Pro',
        price: 3200,
        rating: 4.4,
        reviews: 89,
        image: 'https://placehold.co/400x300/7c3aed/white?text=Chaff+Cutter',
        description: 'Heavy-duty chaff cutter for cutting fodder, ideal for livestock farming.',
        category: 'Hand Tools',
        inStock: true,
    },
    {
        id: 'E005',
        name: 'Wheelbarrow Heavy Duty',
        brand: 'Stanley',
        price: 2800,
        rating: 4.7,
        reviews: 223,
        image: 'https://placehold.co/400x300/dc2626/white?text=Wheelbarrow',
        description: 'Galvanized steel wheelbarrow with pneumatic tire for easy material transport.',
        category: 'Accessories',
        inStock: false,
    },
    {
        id: 'E006',
        name: 'Irrigation Timer Digital',
        brand: 'Rain Bird',
        price: 1800,
        rating: 4.6,
        reviews: 167,
        image: 'https://placehold.co/400x300/1e40af/white?text=Timer',
        description: 'Programmable digital timer for automated irrigation scheduling.',
        category: 'Accessories',
        inStock: true,
    },
    {
        id: 'E007',
        name: 'Cordless Hedge Trimmer',
        brand: 'Black+Decker',
        price: 5500,
        rating: 4.7,
        reviews: 145,
        image: 'https://placehold.co/400x300/15803d/white?text=Hedge+Trimmer',
        description: 'Lightweight cordless trimmer with dual-action blade for clean hedging.',
        category: 'Power Tools',
        inStock: true,
    },
    {
        id: 'E008',
        name: 'Sickle Stainless Steel',
        brand: 'Traditional Tools',
        price: 350,
        rating: 4.3,
        reviews: 412,
        image: 'https://placehold.co/400x300/ca8a04/white?text=Sickle',
        description: 'Sharp stainless steel sickle for harvesting crops and cutting grass.',
        category: 'Hand Tools',
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
            category: 'Equipment'
        });
        toast.success(`${product.name} (${quantity}) added to cart!`);
    };

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    const categoryColors = {
        'Hand Tools': 'bg-orange-100 text-orange-700',
        'Power Tools': 'bg-blue-100 text-blue-700',
        'Accessories': 'bg-purple-100 text-purple-700',
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
                    <div className={`px-3 py-1 rounded-full text-xs font-black ${categoryColors[product.category]}`}>
                        {product.category}
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
                        <p className="text-xs font-bold text-orange-600 mb-1">{product.brand}</p>
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
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
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

export default function EquipmentPage() {
    const [filter, setFilter] = useState<'all' | 'Hand Tools' | 'Power Tools' | 'Accessories'>('all');

    const filteredProducts = sampleEquipment.filter((product) => {
        if (filter === 'all') return true;
        return product.category === filter;
    });

    return (
        <div className="space-y-12">
            <section className="text-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 mb-6"
                >
                    <div className="p-4 bg-orange-600 rounded-2xl shadow-xl">
                        <Wrench className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-earth-900">
                        Farming <span className="text-orange-600">Equipment</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-earth-800/60 font-medium"
                >
                    Essential tools and equipment for efficient farm operations
                </motion.p>
            </section>

            <section className="flex justify-center gap-4 flex-wrap">
                {[
                    { value: 'all', label: 'All Equipment' },
                    { value: 'Hand Tools', label: 'Hand Tools' },
                    { value: 'Power Tools', label: 'Power Tools' },
                    { value: 'Accessories', label: 'Accessories' },
                ].map((btn) => (
                    <button
                        key={btn.value}
                        onClick={() => setFilter(btn.value as any)}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all ${filter === btn.value
                            ? 'bg-orange-600 text-white shadow-lg'
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
                        <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <div className="text-3xl font-black text-earth-900">100%</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Quality Assured</div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-earth-900">1 Year</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Warranty on Tools</div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-earth-900">7 Days</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Easy Returns</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
