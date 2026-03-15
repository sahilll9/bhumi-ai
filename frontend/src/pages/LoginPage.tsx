import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { authAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.login(username, password);
            login(response.data.access_token, response.data.user);
            toast.success('Welcome back, ' + response.data.user.full_name);
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative background blobs - adds depth without clutter */}
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-bhumi-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-saffron/10 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass-card p-10 rounded-3xl relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-bhumi-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    >
                        <ShieldCheck className="w-12 h-12 text-bhumi-primary" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-earth-900 mb-2">Welcome Back</h2>
                    <p className="text-earth-800/60 font-medium">Access your survey dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Username Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-earth-800/40 group-focus-within:text-bhumi-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full pl-11 pr-4 py-4 bg-white/50 border border-white/30 rounded-2xl 
                           focus:ring-2 focus:ring-bhumi-primary/20 focus:border-bhumi-primary outline-none transition-all
                           placeholder:text-earth-800/20 text-earth-900"
                                placeholder="Username"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-earth-800/40 group-focus-within:text-bhumi-primary transition-colors" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-11 pr-4 py-4 bg-white/50 border border-white/30 rounded-2xl 
                           focus:ring-2 focus:ring-bhumi-primary/20 focus:border-bhumi-primary outline-none transition-all
                           placeholder:text-earth-800/20 text-earth-900"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium w-full !py-4 bg-bhumi-dark text-white hover:bg-black"
                    >
                        {loading ? (
                            <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-earth-800/60 font-medium">
                        New to Bhumi AI?{' '}
                        <Link to="/register" className="text-bhumi-primary hover:underline font-bold transition-all">
                            Create an account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
