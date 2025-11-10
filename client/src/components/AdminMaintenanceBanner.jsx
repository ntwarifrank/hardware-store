import { AlertCircle, Shield, X } from 'lucide-react';
import { useState } from 'react';

const AdminMaintenanceBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full animate-pulse">
              <AlertCircle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Shield size={16} />
                <span className="font-bold text-sm">MAINTENANCE MODE ACTIVE</span>
              </div>
              <p className="text-xs text-white/90">
                Site is in maintenance mode. Users cannot access the site. You're viewing as Admin.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close banner"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMaintenanceBanner;
