import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

const AdminPage = lazy(() => import('./pages/AdminPage'));
const BonusesPage = lazy(() => import('./pages/BonusesPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ContactsPage = lazy(() => import('./pages/ContactsPage'));
const CreditPage = lazy(() => import('./pages/CreditPage'));
const DeliveryPage = lazy(() => import('./pages/DeliveryPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const MyProductsPage = lazy(() => import('./pages/MyProductsPage'));
const OfferPage = lazy(() => import('./pages/OfferPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PromotionsPage = lazy(() => import('./pages/PromotionsPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const TradeInPage = lazy(() => import('./pages/TradeInPage'));
const WarrantyPage = lazy(() => import('./pages/WarrantyPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user && isAdmin ? children : <Navigate to="/" />;
};

const AppLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[var(--bg-layer)] text-[var(--ink-strong)]">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes location={location} key={`${location.pathname}${location.search}`}>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/warranty" element={<WarrantyPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/profile/orders" element={<OrderTrackingPage />} />
            <Route path="/bonuses" element={<BonusesPage />} />
            <Route path="/trade-in" element={<TradeInPage />} />
            <Route path="/credit" element={<CreditPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/offer" element={<OfferPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <CartPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <OrdersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-products"
              element={
                <PrivateRoute>
                  <MyProductsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      <Footer />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 3200,
          style: {
            background: 'rgba(255, 255, 255, 0.92)',
            color: '#111827',
            border: '1px solid rgba(255,255,255,0.7)',
            borderRadius: '16px',
            boxShadow: '0 24px 54px -32px rgba(19, 28, 45, 0.45)',
            backdropFilter: 'blur(18px)',
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <AppLayout />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
