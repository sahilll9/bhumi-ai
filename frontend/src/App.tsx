/**
 * ============================================================================
 * FRONTEND - MAIN APP HUB
 * ============================================================================
 * Core routing and global state providers.
 * Protected routes ensure only authorized users access survey data.
 * ============================================================================
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Core Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import VillagesPage from './pages/VillagesPage';
import SchemeAdvisorPage from './pages/SchemeAdvisorPage';
import SubsidyCalculatorPage from './pages/SubsidyCalculatorPage';
import ChatbotPage from './pages/ChatbotPage';
import PitchDeckPage from './pages/PitchDeckPage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandRegistrationPage from './pages/LandRegistrationPage';
import AdminDataPage from './pages/AdminDataPage';

// Marketplace Pages
import MarketplacePage from './pages/MarketplacePage';
import MachineryPage from './pages/marketplace/MachineryPage';
import FertilizerPage from './pages/marketplace/FertilizerPage';
import EquipmentPage from './pages/marketplace/EquipmentPage';
import EquipmentRentalPage from './pages/marketplace/EquipmentRentalPage';
import IrrigationPage from './pages/marketplace/IrrigationPage';
import LoanPage from './pages/marketplace/LoanPage';
import InsurancePage from './pages/marketplace/InsurancePage';
import ShoppingSectionPage from './pages/marketplace/ShoppingSectionPage';

/**
 * Helper component for routes that require login
 */
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Auth Flow */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Business Intelligence Routes */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/villages" element={<PrivateRoute><VillagesPage /></PrivateRoute>} />
          <Route path="/scheme-advisor" element={<PrivateRoute><SchemeAdvisorPage /></PrivateRoute>} />
          <Route path="/subsidy-calculator" element={<PrivateRoute><SubsidyCalculatorPage /></PrivateRoute>} />
          <Route path="/chatbot" element={<PrivateRoute><ChatbotPage /></PrivateRoute>} />
          <Route path="/register-land" element={<PrivateRoute><LandRegistrationPage /></PrivateRoute>} />
          <Route path="/admin-data" element={<PrivateRoute><AdminDataPage /></PrivateRoute>} />
          <Route path="/pitch" element={<PitchDeckPage />} />

          {/* Marketplace Routes */}
          <Route path="/marketplace" element={<PrivateRoute><MarketplacePage /></PrivateRoute>} />
          <Route path="/marketplace/machinery" element={<PrivateRoute><MachineryPage /></PrivateRoute>} />
          <Route path="/marketplace/fertilizer" element={<PrivateRoute><FertilizerPage /></PrivateRoute>} />
          <Route path="/marketplace/equipment" element={<PrivateRoute><EquipmentPage /></PrivateRoute>} />
          <Route path="/marketplace/rentals" element={<PrivateRoute><EquipmentRentalPage /></PrivateRoute>} />
          <Route path="/marketplace/irrigation" element={<PrivateRoute><IrrigationPage /></PrivateRoute>} />
          <Route path="/marketplace/loan" element={<PrivateRoute><LoanPage /></PrivateRoute>} />
          <Route path="/marketplace/insurance" element={<PrivateRoute><InsurancePage /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><ShoppingSectionPage /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
      {/* Premium notification system */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'glass-card !rounded-2xl !text-sm !font-bold !text-earth-900',
          duration: 4000,
        }}
      />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <LanguageProvider>
          <AppRoutes />
        </LanguageProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
