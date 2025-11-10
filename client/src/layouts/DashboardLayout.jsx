import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import {
  Home,
  ShoppingCart,
  Heart,
  User,
  Package,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  Laptop,
  Shirt,
  ShoppingBag,
  Utensils,
  TrendingUp,
  Star,
  MessageSquare,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

const DashboardLayout = () => {
  const { user, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  // Build menu items conditionally
  const menuItems = [
    {
      category: 'Browse',
      items: [
        { name: 'Discover', icon: Home, path: '/products', badge: null },
        { name: 'Electronics', icon: Laptop, path: '/products?category=electronics', badge: null },
        { name: 'Clothes', icon: Shirt, path: '/products?category=clothes', badge: null },
        { name: 'Bags', icon: ShoppingBag, path: '/products?category=bags', badge: null },
        { name: 'Food', icon: Utensils, path: '/products?category=food', badge: null },
        { name: 'Popular Products', icon: TrendingUp, path: '/products?sort=popular', badge: null },
        { name: 'Top Sellers', icon: Star, path: '/products?sort=bestseller', badge: null },
      ],
    },
    // Only show Account section for logged in users
    ...(user ? [{
      category: 'Account',
      items: [
        { name: 'Cart', icon: ShoppingCart, path: '/cart', badge: totalItems || null },
        { name: 'Wishlist', icon: Heart, path: '/wishlist', badge: wishlistItems?.length || null },
        { name: 'Orders', icon: Package, path: '/orders', badge: null },
        { name: 'Profile', icon: User, path: '/profile', badge: null },
        { name: 'My Messages', icon: MessageSquare, path: '/my-messages', badge: null },
      ],
    }] : []),
    {
      category: 'Other',
      items: [
        { name: 'Settings', icon: Settings, path: '/settings', badge: null },
        { name: 'Help', icon: HelpCircle, path: '/help', badge: null },
      ],
    },
  ];

  const isActive = (path) => {
    if (path === '/products') {
      return location.pathname === '/products' && !location.search;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <ShoppingBag className="text-white" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Hardware
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white -mt-1">
                  Store
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {menuItems.map((section) => (
              <div key={section.category}>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {section.category}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                            active
                              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={20} className="flex-shrink-0" />
                            <span className="font-medium text-sm">{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className={`px-2 py-1 text-xs font-bold rounded-full flex-shrink-0 ${
                              active ? 'bg-white text-orange-600' : 'bg-orange-500 text-white'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {isAdmin && user && (
              <Link
                to="/admin"
                className="w-full btn btn-primary text-sm py-2 mb-3 block text-center"
              >
                Admin Panel
              </Link>
            )}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              © 2025 Hardware Store
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-[#1e293b] dark:bg-[#0f172a] border-b border-gray-700">
          <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3">
            {/* Mobile Menu + Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white hover:text-gray-300"
              >
                <Menu size={24} />
              </button>
              
              {/* Logo - Hidden on desktop, shown on mobile */}
              <Link to="/" className="lg:hidden flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="text-white" size={20} />
                </div>
                <span className="text-lg font-bold text-white">
                  Hardware Store
                </span>
              </Link>
            </div>

            {/* Search Bar with Button */}
            <div className="flex-1 max-w-2xl mx-auto px-2 lg:px-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const searchValue = e.target.search.value;
                  if (searchValue) navigate(`/products?search=${searchValue}`);
                }}
                className="flex"
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Search for products, categories..."
                  className="flex-1 px-4 py-2.5 bg-[#334155] dark:bg-[#1e293b] border-0 rounded-l-full focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 text-sm"
                />
                <button
                  type="submit"
                  className="px-4 lg:px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-r-full flex items-center gap-2 transition-all whitespace-nowrap"
                >
                  <Search size={18} />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </form>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors text-gray-300"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2.5 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors relative text-gray-300"
              >
                <Heart size={20} />
                {wishlistItems?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2.5 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors relative text-gray-300"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Button */}
              {user ? (
                <Link
                  to="/profile"
                  className="hidden sm:flex px-3 lg:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-full items-center gap-2 transition-all text-sm"
                >
                  <User size={18} />
                  <span className="hidden md:inline">{user.name?.split(' ')[0] || 'User'}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-3 lg:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-full transition-all text-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;
