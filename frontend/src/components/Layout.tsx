import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, MapPin, Lightbulb, MessageCircle, LogOut, ShoppingBag, ChevronDown, Tractor, Sprout, Wrench, Droplets, CreditCard, ShieldCheck, Info, Calculator, Key, Monitor } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

/**
 * ============================================================================
 * LAYOUT COMPONENT - PREMIUM HUB
 * ============================================================================
 * Provides a floating glass navbar and consistent spacing for all pages.
 * Integrates Auth state for dynamic navigation.
 * ============================================================================
 */

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { t, language, setLanguage } = useLanguage();
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: Info },
    ...(user ? [
      { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
      { path: '/villages', label: 'Villages', icon: MapPin },
      { path: '/scheme-advisor', label: 'Advisor', icon: Lightbulb },
      { path: '/subsidy-calculator', label: 'Calculator', icon: Calculator },
      { path: '/chatbot', label: 'AI Chat', icon: MessageCircle },
      { path: '/register-land', label: 'Register Land', icon: MapPin },
      { path: '/admin-data', label: 'Data', icon: BarChart3 },
      { path: '/pitch', label: 'Pitch Deck', icon: Monitor }
    ] : [])
  ];

  const marketplaceCategories = [
    { path: '/marketplace/equipment', label: 'Equipment', icon: Wrench, color: 'text-orange-600' },
    { path: '/marketplace/fertilizer', label: 'Fertilizer', icon: Sprout, color: 'text-green-600' },
    { path: '/marketplace/insurance', label: 'Insurance', icon: ShieldCheck, color: 'text-indigo-600' },
    { path: '/marketplace/irrigation', label: 'Irrigation', icon: Droplets, color: 'text-cyan-600' },
    { path: '/marketplace/loan', label: 'Loan Services', icon: CreditCard, color: 'text-red-600' },
    { path: '/marketplace/machinery', label: 'Machinery', icon: Tractor, color: 'text-blue-600' },
    { path: '/marketplace/rentals', label: 'Rentals', icon: Key, color: 'text-yellow-600' },
  ];

  return (
    <div className="min-h-screen">
      {/* Premium Floating Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="glass-card !bg-white/70 backdrop-blur-2xl px-6 py-3.5 rounded-3xl flex justify-between items-center border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)] transition-all duration-500">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-11 h-11 bg-bhumi-dark rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-bhumi-dark/30 transition-shadow"
            >
              <span className="text-white font-black text-2xl">B</span>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-bhumi-dark via-bhumi-deep to-bhumi-dark hidden sm:block">
                Bhumi AI
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-earth-800/40 hidden sm:block -mt-1">
                Professional
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <div className="hidden lg:flex items-center gap-0.5 mr-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link px-3 xl:px-4 py-2.5 rounded-xl text-[15px] font-bold transition-all flex items-center gap-2 ${isActive
                      ? 'bg-bhumi-dark text-white shadow-lg shadow-bhumi-dark/20 scale-105'
                      : 'text-earth-900/70 hover:text-earth-900 hover:bg-white/60 hover:scale-105'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t(item.label)}
                  </Link>
                );
              })}

              {/* Marketplace Dropdown */}
              {user && (
                <div
                  className="relative"
                  onMouseEnter={() => setIsMarketplaceOpen(true)}
                  onMouseLeave={() => setIsMarketplaceOpen(false)}
                >
                  <button
                    className={`nav-link px-3 xl:px-4 py-2.5 rounded-xl text-[15px] font-bold transition-all flex items-center gap-2 ${location.pathname.startsWith('/marketplace')
                      ? 'bg-bhumi-dark text-white shadow-lg shadow-bhumi-dark/20 scale-105'
                      : 'text-earth-900/70 hover:text-earth-900 hover:bg-white/60 hover:scale-105'
                      }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {t('Marketplace')}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMarketplaceOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isMarketplaceOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full mt-2 left-0 w-56 glass-card !bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 p-2 z-50"
                    >
                      {marketplaceCategories.map((category) => {
                        const Icon = category.icon;
                        const isActive = location.pathname === category.path;
                        return (
                          <Link
                            key={category.path}
                            to={category.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                              ? 'bg-bhumi-dark text-white'
                              : 'text-earth-900/80 hover:bg-white/70'
                              }`}
                          >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : category.color}`} />
                            <span className="font-bold text-sm">{t(category.label)}</span>
                            {category.label === 'Loan Services' && !isActive && (
                              <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-black">
                                HOT
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              )}
              {/* Language Switcher */}
              <div className="flex items-center ml-2 border-l border-earth-900/10 pl-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-transparent text-[13px] font-black outline-none cursor-pointer text-earth-900 uppercase tracking-wider hover:text-bhumi-dark transition-colors"
                >
                  <option value="en">EN</option>
                  <option value="hi">हिंदी</option>
                  <option value="te">తెలుగు</option>
                  <option value="ta">தமிழ்</option>
                </select>
              </div>
            </div>

            {user ? (
              <div className="flex items-center gap-3 pl-3 lg:pl-6 border-l border-earth-900/10">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-earth-900 mb-0">{user.full_name}</p>
                  <p className="text-[11px] text-earth-800/50 uppercase tracking-widest font-black">{user.role}</p>
                </div>

                {/* Cart Icon in Header */}
                <Link
                  to="/cart"
                  className="relative p-2.5 rounded-xl bg-bhumi-primary/10 text-bhumi-primary hover:bg-bhumi-primary/20 transition-all group"
                  title="Your Cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-bhumi-dark text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-300">
                      {totalItems}
                    </span>
                  )}
                </Link>

                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="px-5 py-2.5 rounded-xl text-sm font-bold text-earth-900 hover:bg-white/50 transition-all">
                  {t('Sign In')}
                </Link>
                <Link to="/register" className="btn-premium !py-2.5 !px-5 bg-bhumi-dark text-white hover:bg-black text-sm">
                  {t('Get Started')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>

    </div>
  );
}
