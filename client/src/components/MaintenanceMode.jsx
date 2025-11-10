import { Wrench, MessageCircle, Clock, Shield, AlertTriangle, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

const MaintenanceMode = () => {
  const [dots, setDots] = useState('');

  // Animated loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Prevent any interactions
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e) => e.preventDefault();
    // Disable certain keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-white/5 rounded-full -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-white/5 rounded-full -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="max-w-2xl w-full relative z-10">
        {/* Security Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20">
            <Lock size={16} />
            <span className="text-sm font-semibold">Secure Maintenance Mode</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center backdrop-blur-sm border-2 border-orange-200 dark:border-orange-800">
          {/* Icon with animation */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-full mb-6 animate-bounce shadow-lg">
            <Wrench size={48} className="text-orange-600 dark:text-orange-400" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            We'll Be Right Back!
          </h1>

          {/* Subtitle with status */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide">
              Status: Under Maintenance{dots}
            </p>
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Our store is currently undergoing scheduled maintenance to serve you better
          </p>

          {/* Information Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* What's happening */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 text-left border border-orange-200 dark:border-orange-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <Clock size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    In Progress
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    System upgrades and improvements
                  </p>
                </div>
              </div>
            </div>

            {/* Security notice */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 text-left border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    Protected
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your data is safe and secure
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Expected time */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-8 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-center gap-2 text-yellow-800 dark:text-yellow-400">
              <AlertTriangle size={20} />
              <p className="text-sm font-semibold">
                We'll be back online shortly. Please check back in a few minutes.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">
              Need urgent assistance?
            </p>
            <a
              href="https://wa.me/250725382459?text=Hello,%20I%20need%20assistance%20with%20the%20hardware%20store"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-8 py-3 rounded-full transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <MessageCircle size={20} />
              Contact on WhatsApp
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
              WhatsApp: +250 725 382 459
            </p>
          </div>

          {/* Admin Access Button */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                console.log('🔘 Admin Access button clicked!');
                // Always show prompt - keyword validation will handle access
                const event = new CustomEvent('showAdminPrompt');
                window.dispatchEvent(event);
              }}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-semibold px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 group"
            >
              <Shield size={20} className="group-hover:rotate-12 transition-transform" />
              <span>Admin Access</span>
              <Lock size={16} />
            </button>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
              Enter security keyword to access
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              🙏 Thank you for your patience and understanding
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Access temporarily restricted • Normal users cannot login during maintenance
            </p>
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-3 text-white px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <div className="w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-lg flex items-center justify-center">
              <Wrench size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold drop-shadow-lg">BuildMart Hardware</span>
          </div>
          <p className="text-white/80 text-sm mt-4 font-medium">
            Trusted Hardware Solutions Since 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
