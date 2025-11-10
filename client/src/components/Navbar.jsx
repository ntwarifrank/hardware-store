import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  LogOut,
  Package,
  Moon,
  Sun,
  Shield,
  Bell
} from 'lucide-react';
import { useState } from 'react';
import { logout } from '../features/auth/authSlice';
import { toggleTheme } from '../features/ui/uiSlice';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin } = useAuth();
  const { totalItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const theme = useSelector((state) => state.ui.theme);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <Package className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Hardware Store
            </span>
          </Link>

          {/* Search Bar - Desktop (Alibaba Style) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, categories..."
                className="flex-1 pl-5 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-l-full focus:outline-none focus:border-orange-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-r-full flex items-center gap-2 transition-all shadow-md"
              >
                <Search size={20} strokeWidth={2.5} />
                Search
              </button>
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-all hover:shadow-lg hover:scale-110"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications - Only for authenticated users */}
            {isAuthenticated && <NotificationBell />}

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 relative transition-all hover:shadow-lg hover:scale-110"
              title="Wishlist"
            >
              <Heart size={22} strokeWidth={2} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 relative transition-all hover:shadow-lg hover:scale-110"
              title="Shopping Cart"
            >
              <ShoppingCart size={22} strokeWidth={2} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md hover:shadow-xl transition-all hover:scale-105">
                  <div className="p-1 bg-white/20 rounded-lg">
                    <User size={18} />
                  </div>
                  <span className="font-semibold">{user?.name}</span>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
                  >
                    <User size={18} />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
                  >
                    <Package size={18} />
                    <span className="font-medium">My Orders</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-primary-700 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 transition-all font-medium"
                    >
                      <Shield size={18} />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all font-medium"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-5 py-2.5 rounded-xl border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-500 dark:text-primary-400 dark:hover:bg-primary-900/20 font-semibold transition-all hover:shadow-lg hover:scale-105">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-all hover:shadow-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 pt-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 pl-5 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-l-full focus:outline-none focus:border-orange-500 dark:text-white placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-r-full flex items-center gap-2"
                >
                  <Search size={18} strokeWidth={2.5} />
                </button>
              </div>
            </form>

            {/* Mobile Links */}
            <div className="space-y-2">
              <Link
                to="/wishlist"
                className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Heart size={20} />
                  <span className="font-medium">Wishlist</span>
                </div>
                {wishlistItems.length > 0 && (
                  <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart size={20} />
                  <span className="font-medium">Cart</span>
                </div>
                {totalItems > 0 && (
                  <span className="px-2.5 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="pt-4 space-y-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl transition-all shadow-sm"
                    >
                      <User size={20} />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <Link
                      to="/notifications"
                      className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl transition-all shadow-sm"
                    >
                      <Bell size={20} />
                      <span className="font-medium">Notifications</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl transition-all shadow-sm"
                    >
                      <Package size={20} />
                      <span className="font-medium">My Orders</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-900/20 text-primary-700 hover:bg-primary-100 dark:text-primary-400 dark:hover:bg-primary-900/30 rounded-xl transition-all shadow-sm font-medium"
                      >
                        <Shield size={20} />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-xl transition-all shadow-sm font-medium"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="pt-4 space-y-2">
                    <Link to="/login" className="block px-5 py-3 text-center border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-500 dark:text-primary-400 dark:hover:bg-primary-900/20 font-semibold rounded-xl transition-all shadow-sm">
                      Login
                    </Link>
                    <Link to="/register" className="block px-5 py-3 text-center bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg transition-all">
                      Register
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
