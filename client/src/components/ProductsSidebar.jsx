import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  Zap, 
  Shirt, 
  ShoppingBag, 
  UtensilsCrossed, 
  TrendingUp, 
  Award, 
  Rss,
  Mail,
  Settings,
  HelpCircle,
  Home
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const ProductsSidebar = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');
  const currentSort = searchParams.get('sort');
  const currentFeatured = searchParams.get('featured');

  const menuItems = [
    { name: 'Home', icon: Home, path: '/', badge: null },
    { name: 'Discover', icon: Compass, path: '/products', badge: null, exact: true },
    { name: 'Electronics', icon: Zap, path: '/products?category=electronics', category: 'electronics' },
    { name: 'Clothes', icon: Shirt, path: '/products?category=clothes', category: 'clothes' },
    { name: 'Bags', icon: ShoppingBag, path: '/products?category=bags', category: 'bags' },
    { name: 'Food', icon: UtensilsCrossed, path: '/products?category=food', category: 'food' },
    { name: 'Popular Products', icon: TrendingUp, path: '/products?sort=-averageRating', sort: '-averageRating' },
    { name: 'Top Sellers', icon: Award, path: '/products?featured=true', featured: 'true' },
    { name: 'Feed', icon: Rss, path: '/feed', badge: null },
    { name: 'Contact', icon: Mail, path: '/contact', badge: null },
  ];

  const bottomItems = [
    { name: 'Setting', icon: Settings, path: '/settings' },
    { name: 'Help', icon: HelpCircle, path: '/help' },
  ];

  return (
    <aside className="w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">Hardware Store</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuItems.filter(item => {
            // Hide Home if user is authenticated
            if (item.name === 'Home' && isAuthenticated) {
              return false;
            }
            return true;
          }).map((item) => {
            const Icon = item.icon;
            
            // Determine if this item is active
            let isActive = false;
            if (item.exact) {
              // For "Discover" - active only when on /products with no params
              isActive = location.pathname === '/products' && !currentCategory && !currentSort && !currentFeatured;
            } else if (item.category) {
              isActive = currentCategory === item.category;
            } else if (item.sort) {
              isActive = currentSort === item.sort;
            } else if (item.featured) {
              isActive = currentFeatured === item.featured;
            } else {
              isActive = location.pathname === item.path;
            }
            
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon 
                      size={18} 
                      className={isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-orange-500'} 
                      strokeWidth={2}
                    />
                    <span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                      {item.name}
                    </span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <ul className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
                >
                  <Icon size={18} className="text-gray-500 dark:text-gray-400 group-hover:text-orange-500" strokeWidth={2} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 text-center border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Copyright © 2025 by UI Lib
        </p>
      </div>
    </aside>
  );
};

export default ProductsSidebar;
