import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, Mail, ArrowRight } from 'lucide-react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authAPI.register(formData);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "block w-full pl-11 pr-4 py-3 bg-white/50 border border-white/30 rounded-2xl focus:ring-2 focus:ring-bhumi-primary/20 focus:border-bhumi-primary outline-none transition-all placeholder:text-earth-800/20 text-earth-900";

    return (
        <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-bhumi-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-saffron/10 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass-card p-10 rounded-3xl relative z-10"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-bhumi-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    >
                        <UserPlus className="w-8 h-8 text-bhumi-primary" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-earth-900 mb-2">Join Bhumi AI</h2>
                    <p className="text-earth-800/60 font-medium">Empowering rural intelligence</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-earth-800/40 group-focus-within:text-bhumi-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            required
                            className={inputClasses}
                            placeholder="Full Name"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-earth-800/40 group-focus-within:text-bhumi-primary transition-colors" />
                        </div>
                        <input
                            type="email"
                            required
                            className={inputClasses}
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-earth-800/40 group-focus-within:text-bhumi-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            required
                            className={inputClasses}
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-earth-800/40 group-focus-within:text-bhumi-primary transition-colors" />
                        </div>
                        <input
                            type="password"
                            required
                            className={inputClasses}
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium w-full !py-3.5 bg-bhumi-dark text-white hover:bg-black mt-4"
                    >
                        {loading ? (
                            <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Create Account
                                <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-white/20 pt-6">
                    <p className="text-sm text-earth-800/60 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-bhumi-primary hover:underline font-bold transition-all">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
