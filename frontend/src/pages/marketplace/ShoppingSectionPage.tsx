import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * ============================================================================
 * SHOPPING SECTION (CART PAGE)
 * ============================================================================
 * Displays items added to cart with quantity management and checkout.
 * ============================================================================
 */

export default function ShoppingSectionPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

    const handleCheckout = () => {
        toast.success("Order placed successfully! (Demo)");
        clearCart();
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
                <div className="p-8 bg-gray-100 rounded-full">
                    <ShoppingCart className="w-16 h-16 text-gray-400" />
                </div>
                <h2 className="text-3xl font-black text-earth-900">Your cart is empty</h2>
                <p className="text-earth-800/60 font-medium">Add some items from the marketplace to get started!</p>
                <Link
                    to="/marketplace"
                    className="btn-premium px-8 py-3 bg-bhumi-primary text-white flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-earth-900 mb-2">Shopping Section</h1>
                    <p className="text-earth-800/60 font-medium">You have {totalItems} items in your cart</p>
                </div>
                <button
                    onClick={() => clearCart()}
                    className="text-red-600 font-bold hover:text-red-700 transition-colors flex items-center gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear Entire Cart
                </button>
            </section>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-6 flex items-center gap-6"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-2xl"
                            />

                            <div className="flex-grow">
                                <p className="text-xs font-bold text-bhumi-primary uppercase tracking-widest">{item.category}</p>
                                <h3 className="text-xl font-black text-earth-900">{item.name}</h3>
                                <p className="text-lg font-black text-earth-800/80">₹{item.price.toLocaleString('en-IN')}</p>
                            </div>

                            <div className="flex items-center gap-4 bg-white/50 p-2 rounded-2xl border border-white/40">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 hover:bg-white rounded-lg transition-colors"
                                >
                                    <Minus className="w-4 h-4 text-earth-900" />
                                </button>
                                <span className="w-8 text-center font-black text-earth-900">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 hover:bg-white rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4 text-earth-900" />
                                </button>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Summary Sidebar */}
                <div className="space-y-6">
                    <div className="glass-card p-8 sticky top-32">
                        <h3 className="text-2xl font-black text-earth-900 mb-6">Order Summary</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-earth-800/60 font-bold">
                                <span>Subtotal ({totalItems} items)</span>
                                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-earth-800/60 font-bold">
                                <span>Delivery Fee</span>
                                <span className="text-green-600 uppercase">Free</span>
                            </div>
                            <div className="h-px bg-earth-900/10" />
                            <div className="flex justify-between text-2xl font-black text-earth-900">
                                <span>Total</span>
                                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full btn-premium py-4 bg-bhumi-dark text-white flex items-center justify-center gap-3 text-lg"
                        >
                            <CreditCard className="w-5 h-5" />
                            Place Order
                        </button>

                        <p className="mt-6 text-center text-xs text-earth-800/40 font-bold">
                            SECURE PAYMENTS POWERED BY BHUMI FINTECH
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
