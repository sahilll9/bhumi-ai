import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Instagram, Globe, Mail, MapPin, Users, Target, Shield } from 'lucide-react';

export default function AboutPage() {
    const socials = [
        { icon: Globe, label: 'Website', href: '#', color: 'hover:text-blue-500' },
        { icon: Github, label: 'GitHub', href: '#', color: 'hover:text-gray-900' },
        { icon: Twitter, label: 'Twitter', href: '#', color: 'hover:text-sky-400' },
        { icon: Linkedin, label: 'LinkedIn', href: '#', color: 'hover:text-blue-700' },
        { icon: Instagram, label: 'Instagram', href: '#', color: 'hover:text-pink-600' },
    ];

    const stats = [
        { icon: Users, label: 'Farmers Impacted', value: '50,000+' },
        { icon: Target, label: 'Villages Covered', value: '250+' },
        { icon: Shield, label: 'Land Securely Registered', value: '1.2M Acres' },
    ];

    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="text-center max-w-4xl mx-auto relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-bhumi-primary/10 rounded-full blur-3xl -z-10" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bhumi-dark text-white text-xs font-black tracking-widest mb-8"
                >
                    🌱 OUR MISSION
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl md:text-8xl font-black text-earth-900 leading-[0.9] tracking-tighter mb-8"
                >
                    Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-bhumi-dark to-bhumi-primary">Rural India</span> Through Intelligence.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-earth-800/60 font-medium max-w-2xl mx-auto leading-relaxed"
                >
                    Bhumi AI is more than just a platform; it's a digital revolution for the heart of India. We bridge the gap between traditional wisdom and modern technology to ensure every farmer thrives.
                </motion.p>
            </section>

            {/* Core Values / Stats */}
            <section className="grid md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="glass-card p-10 rounded-[40px] text-center group hover:bg-white/60 transition-colors"
                    >
                        <div className="w-16 h-16 bg-bhumi-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <stat.icon className="w-8 h-8 text-bhumi-dark" />
                        </div>
                        <h3 className="text-4xl font-black text-earth-900 mb-2">{stat.value}</h3>
                        <p className="text-sm font-bold text-earth-800/40 uppercase tracking-widest">{stat.label}</p>
                    </motion.div>
                ))}
            </section>

            {/* Content Section */}
            <section className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <h2 className="text-4xl font-black text-earth-900 leading-tight">
                        Rooted in Data,<br />
                        <span className="text-bhumi-primary">Growing with Community.</span>
                    </h2>
                    <div className="space-y-4">
                        <p className="text-lg text-earth-800/70 font-medium">
                            Our AI-driven insights help farmers optimize their yields, access government schemes effortlessly, and connect with a global marketplace of resources.
                        </p>
                        <p className="text-lg text-earth-800/70 font-medium">
                            By leveraging satellite data, LLMs, and real-time market trends, we're building a sustainable future for agriculture where technology serves nature.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-xl border border-white">
                            <MapPin className="w-4 h-4 text-bhumi-dark" />
                            <span className="text-sm font-bold text-earth-900">Headquartered in Rural Bharat</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-xl border border-white">
                            <Mail className="w-4 h-4 text-bhumi-dark" />
                            <span className="text-sm font-bold text-earth-900">contact@bhumiai.com</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card rounded-[50px] p-12 relative overflow-hidden aspect-square flex flex-col justify-center items-center text-center"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-bhumi-primary/5 to-transparent -z-10" />
                    <h3 className="text-3xl font-black text-earth-900 mb-6">Join Our Community</h3>
                    <p className="text-earth-800/60 font-medium mb-10 max-w-xs">
                        Stay updated with our latest features, stories from the field, and agricultural breakthroughs.
                    </p>

                    <div className="flex gap-6">
                        {socials.map((social, index) => (
                            <motion.a
                                key={index}
                                href={social.href}
                                whileHover={{ y: -5, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-4 bg-white rounded-2xl shadow-lg border border-earth-900/5 transition-colors ${social.color}`}
                                title={social.label}
                            >
                                <social.icon className="w-6 h-6" />
                            </motion.a>
                        ))}
                    </div>

                    <div className="mt-12 w-full pt-8 border-t border-earth-900/5">
                        <p className="text-xs font-black text-earth-800/30 uppercase tracking-[0.3em]">Connect with Bhumi AI</p>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
