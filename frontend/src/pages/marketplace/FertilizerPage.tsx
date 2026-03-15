import { motion } from 'framer-motion';
import { Sprout, ShoppingCart, Star, Leaf } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '../../contexts/CartContext';
import { Plus, Minus } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    unit: string;
    rating: number;
    reviews: number;
    image: string;
    description: string;
    type: 'Organic' | 'Chemical' | 'Bio';
    inStock: boolean;
}

const sampleFertilizers: Product[] = [
    {
        id: 'F001',
        name: 'NPK Complex 19-19-19',
        brand: 'IFFCO',
        price: 1200,
        unit: '50kg bag',
        rating: 4.7,
        reviews: 234,
        image: 'https://placehold.co/400x300/16a34a/white?text=NPK+Fertilizer',
        description: 'Balanced NPK formula for all-purpose crop nutrition and healthy plant growth.',
        type: 'Chemical',
        inStock: true,
    },
    {
        id: 'F002',
        name: 'Organic Vermicompost',
        brand: 'Nature Fresh',
        price: 800,
        unit: '40kg bag',
        rating: 4.9,
        reviews: 456,
        image: 'https://placehold.co/400x300/15803d/white?text=Vermicompost',
        description: 'Premium quality vermicompost enriched with essential nutrients for organic farming.',
        type: 'Organic',
        inStock: true,
    },
    {
        id: 'F003',
        name: 'Urea Fertilizer',
        brand: 'Tata Chemicals',
        price: 650,
        unit: '45kg bag',
        rating: 4.5,
        reviews: 567,
        image: 'https://placehold.co/400x300/0891b2/white?text=Urea',
        description: 'High nitrogen content urea for rapid vegetative growth and greener foliage.',
        type: 'Chemical',
        inStock: true,
    },
    {
        id: 'F004',
        name: 'Bio-Fertilizer Rhizobium',
        brand: 'Bio-Tech',
        price: 450,
        unit: '1kg pack',
        rating: 4.6,
        reviews: 123,
        image: 'https://placehold.co/400x300/7c3aed/white?text=Bio+Fertilizer',
        description: 'Nitrogen-fixing bacteria for legume crops, enhances soil fertility naturally.',
        type: 'Bio',
        inStock: true,
    },
    {
        id: 'F005',
        name: 'Phosphate Rich Compost',
        brand: 'Agri-Green',
        price: 950,
        unit: '50kg bag',
        rating: 4.8,
        reviews: 189,
        image: 'https://placehold.co/400x300/ea580c/white?text=P+Rich+Compost',
        description: 'Phosphorus-enriched organic compost for flowering and root development.',
        type: 'Organic',
        inStock: false,
    },
    {
        id: 'F006',
        name: 'Potash Fertilizer (MOP)',
        brand: 'Coromandel',
        price: 1100,
        unit: '50kg bag',
        rating: 4.4,
        reviews: 298,
        image: 'https://placehold.co/400x300/dc2626/white?text=Potash',
        description: 'Muriate of Potash for enhanced fruit quality and disease resistance.',
        type: 'Chemical',
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
            category: 'Fertilizer'
        });
        toast.success(`${product.name} (${quantity} items) added to cart!`);
    };

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    const typeColors = {
        Organic: 'bg-green-100 text-green-700',
        Chemical: 'bg-blue-100 text-blue-700',
        Bio: 'bg-purple-100 text-purple-700',
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
                <div className="absolute top-4 left-4 flex gap-2">
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
                        <p className="text-xs font-bold text-green-600 mb-1">{product.brand}</p>
                        <h3 className="text-xl font-black text-earth-900">{product.name}</h3>
                        <p className="text-sm font-bold text-earth-800/60">{product.unit}</p>
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
                            ? 'bg-green-600 text-white hover:bg-green-700'
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

export default function FertilizerPage() {
    const [filter, setFilter] = useState<'all' | 'Organic' | 'Chemical' | 'Bio'>('all');

    const filteredProducts = sampleFertilizers.filter((product) => {
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
                    <div className="p-4 bg-green-600 rounded-2xl shadow-xl">
                        <Sprout className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-earth-900">
                        Premium <span className="text-green-600">Fertilizers</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-earth-800/60 font-medium"
                >
                    Choose from organic, chemical, and bio-fertilizers for optimal crop nutrition
                </motion.p>
            </section>

            <section className="flex justify-center gap-4 flex-wrap">
                {[
                    { value: 'all', label: 'All Types' },
                    { value: 'Organic', label: 'Organic' },
                    { value: 'Chemical', label: 'Chemical' },
                    { value: 'Bio', label: 'Bio-Fertilizer' },
                ].map((btn) => (
                    <button
                        key={btn.value}
                        onClick={() => setFilter(btn.value as any)}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all ${filter === btn.value
                            ? 'bg-green-600 text-white shadow-lg'
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
                        <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-3xl font-black text-earth-900">100%</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Genuine Products</div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-earth-900">₹500</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Min. Order Value</div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-earth-900">FREE</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Delivery Above ₹5000</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
