import { motion } from 'framer-motion';
import { Tractor, ShoppingCart, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '../../contexts/CartContext';
import { Plus, Minus } from 'lucide-react';

/**
 * ============================================================================
 * MACHINERY MARKETPLACE
 * ============================================================================
 * Agricultural machinery catalog with sample products
 * ============================================================================
 */

interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    description: string;
    inStock: boolean;
}

const sampleMachinery: Product[] = [
    {
        id: 'M001',
        name: 'Heavy Duty Tractor 50HP',
        brand: 'Mahindra',
        price: 850000,
        rating: 4.8,
        reviews: 142,
        image: 'https://placehold.co/400x300/1e40af/white?text=Tractor+50HP',
        description: 'Powerful 50HP tractor ideal for medium to large farms with advanced fuel efficiency.',
        inStock: true,
    },
    {
        id: 'M002',
        name: 'Mini Tractor 25HP',
        brand: 'John Deere',
        price: 450000,
        rating: 4.6,
        reviews: 89,
        image: 'https://placehold.co/400x300/16a34a/white?text=Mini+Tractor',
        description: 'Compact and efficient mini tractor perfect for small to medium-sized agricultural operations.',
        inStock: true,
    },
    {
        id: 'M003',
        name: 'Harvester Combine',
        brand: 'Case IH',
        price: 3500000,
        rating: 4.9,
        reviews: 67,
        image: 'https://placehold.co/400x300/dc2626/white?text=Harvester',
        description: 'Advanced combine harvester with GPS guidance and automated threshing for maximum productivity.',
        inStock: false,
    },
    {
        id: 'M004',
        name: 'Power Tiller',
        brand: 'VST Tillers',
        price: 85000,
        rating: 4.5,
        reviews: 203,
        image: 'https://placehold.co/400x300/ea580c/white?text=Power+Tiller',
        description: 'Versatile power tiller for land preparation, suitable for various soil types.',
        inStock: true,
    },
    {
        id: 'M005',
        name: 'Rotavator Heavy',
        brand: 'Lemken',
        price: 125000,
        rating: 4.7,
        reviews: 78,
        image: 'https://placehold.co/400x300/7c3aed/white?text=Rotavator',
        description: 'Heavy-duty rotavator for deep soil cultivation and efficient seedbed preparation.',
        inStock: true,
    },
    {
        id: 'M006',
        name: 'Seed Drill Automatic',
        brand: 'AgriTech',
        price: 95000,
        rating: 4.4,
        reviews: 56,
        image: 'https://placehold.co/400x300/0891b2/white?text=Seed+Drill',
        description: 'Precision seed drill with automatic spacing control for uniform crop distribution.',
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
            category: 'Machinery'
        });
        toast.success(`${product.name} (${quantity}) added to cart!`);
    };

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="glass-card rounded-3xl overflow-hidden group"
        >
            {/* Product Image */}
            <div className="relative overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {!product.inStock && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-black">
                        OUT OF STOCK
                    </div>
                )}
                {product.inStock && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-green-600 text-white rounded-full text-xs font-black">
                        IN STOCK
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <p className="text-xs font-bold text-bhumi-primary mb-1">{product.brand}</p>
                        <h3 className="text-xl font-black text-earth-900">{product.name}</h3>
                    </div>
                </div>

                <p className="text-sm text-earth-800/60 mb-4 line-clamp-2">{product.description}</p>

                {/* Rating */}
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
                            ? 'bg-bhumi-primary text-white hover:bg-bhumi-dark'
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

export default function MachineryPage() {
    const [filter, setFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');

    const filteredProducts = sampleMachinery.filter((product) => {
        if (filter === 'inStock') return product.inStock;
        if (filter === 'outOfStock') return !product.inStock;
        return true;
    });

    return (
        <div className="space-y-12">
            {/* Header */}
            <section className="text-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 mb-6"
                >
                    <div className="p-4 bg-blue-600 rounded-2xl shadow-xl">
                        <Tractor className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-earth-900">
                        Agricultural <span className="text-blue-600">Machinery</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-earth-800/60 font-medium"
                >
                    Browse our extensive collection of modern farming machinery and equipment
                </motion.p>
            </section>

            {/* Filters */}
            <section className="flex justify-center gap-4">
                {[
                    { value: 'all', label: 'All Products' },
                    { value: 'inStock', label: 'In Stock' },
                    { value: 'outOfStock', label: 'Out of Stock' },
                ].map((btn) => (
                    <button
                        key={btn.value}
                        onClick={() => setFilter(btn.value as any)}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all ${filter === btn.value
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'glass-card text-earth-900 hover:bg-white/60'
                            }`}
                    >
                        {btn.label}
                    </button>
                ))}
            </section>

            {/* Products Grid */}
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

            {/* Stats Banner */}
            <section className="glass-card rounded-[40px] p-8">
                <div className="grid grid-cols-3 gap-8 text-center">
                    <div>
                        <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-3xl font-black text-earth-900">98%</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Customer Satisfaction</div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-earth-900">24/7</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Support Available</div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-earth-900">5 Years</div>
                        <div className="text-xs font-bold text-earth-800/40 uppercase">Warranty Included</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
