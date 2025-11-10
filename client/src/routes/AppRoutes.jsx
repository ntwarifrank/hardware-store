import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

// Information Pages
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsConditions from '../pages/TermsConditions';
import CookiePolicy from '../pages/CookiePolicy';
import ShippingDelivery from '../pages/ShippingDelivery';
import ReturnsRefunds from '../pages/ReturnsRefunds';
import WarrantyInfo from '../pages/WarrantyInfo';
import FAQ from '../pages/FAQ';
import Help from '../pages/Help';
import Settings from '../pages/Settings';
import MyMessages from '../pages/MyMessages';

// Protected Pages
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Profile from '../pages/Profile';
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';
import Wishlist from '../pages/Wishlist';
import Notifications from '../pages/Notifications';
import PaymentProcessing from '../pages/PaymentProcessing';

// Admin Pages
import AdminDashboard from '../pages/Admin/Dashboard';
import ProductsAdmin from '../pages/Admin/ProductsAdmin';
import OrdersAdmin from '../pages/Admin/OrdersAdmin';
import UsersAdmin from '../pages/Admin/UsersAdmin';
import CategoriesAdmin from '../pages/Admin/CategoriesAdmin';
import NotificationsAdmin from '../pages/Admin/NotificationsAdmin';
import DiscountsAdmin from '../pages/Admin/DiscountsAdmin';
import ProductForm from '../pages/Admin/ProductForm';
import SettingsAdmin from '../pages/Admin/SettingsAdmin';
import MessagesAdmin from '../pages/Admin/MessagesAdmin';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page with Navigation */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
      </Route>

      {/* Auth Pages (No Layout) */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />

      {/* Dashboard Layout for All Other Pages */}
      <Route element={<DashboardLayout />}>
        {/* Products & Browse */}
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        
        {/* Information Pages */}
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsConditions />} />
        <Route path="cookies" element={<CookiePolicy />} />
        <Route path="shipping" element={<ShippingDelivery />} />
        <Route path="returns" element={<ReturnsRefunds />} />
        <Route path="warranty" element={<WarrantyInfo />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="help" element={<Help />} />
        
        {/* Protected Routes */}
        <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="my-messages" element={<ProtectedRoute><MyMessages /></ProtectedRoute>} />
        <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
        <Route path="payment/processing/:orderId" element={<ProtectedRoute><PaymentProcessing /></ProtectedRoute>} />
        <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductsAdmin />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="orders" element={<OrdersAdmin />} />
        <Route path="users" element={<UsersAdmin />} />
        <Route path="categories" element={<CategoriesAdmin />} />
        <Route path="notifications" element={<NotificationsAdmin />} />
        <Route path="discounts" element={<DiscountsAdmin />} />
        <Route path="messages" element={<MessagesAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold">404 - Page Not Found</h1></div>} />
    </Routes>
  );
};

export default AppRoutes;
