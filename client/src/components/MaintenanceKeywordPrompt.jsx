import { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';

const MaintenanceKeywordPrompt = ({ onCorrectKeyword }) => {
  const [keyword, setKeyword] = useState('');
  const [showKeyword, setShowKeyword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  console.log('🔐 Keyword Prompt Rendered!');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🔑 Keyword submitted:', keyword);
    
    // Check if keyword is correct
    if (keyword.toUpperCase() === 'UGWANEZAV2020') {
      // Store in sessionStorage (persists during session)
      sessionStorage.setItem('maintenanceBypass', 'UGWANEZAV2020');
      sessionStorage.setItem('bypassTime', Date.now().toString());
      
      // Success
      setError('');
      onCorrectKeyword();
    } else {
      // Wrong keyword
      setAttempts(prev => prev + 1);
      setError('Incorrect keyword. Access denied.');
      setKeyword('');
      
      // Lock after 3 failed attempts
      if (attempts >= 2) {
        setError('Too many failed attempts. Please try again later.');
        setTimeout(() => {
          setAttempts(0);
          setError('');
        }, 30000); // 30 second lockout
      }
    }
  };

  const isLocked = attempts >= 3;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border-2 border-orange-200 dark:border-orange-800">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-full mb-4">
            <Shield size={32} className="text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Access Required
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter the security keyword to bypass maintenance mode
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Keyword Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Security Keyword
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showKeyword ? 'text' : 'password'}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                disabled={isLocked}
                placeholder="Enter keyword"
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                autoComplete="off"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowKeyword(!showKeyword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKeyword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Attempts Counter */}
          {attempts > 0 && !isLocked && (
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {3 - attempts} attempt{3 - attempts !== 1 ? 's' : ''} remaining
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLocked || !keyword}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {isLocked ? 'Locked - Wait 30s' : 'Verify & Access'}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Lock size={14} className="flex-shrink-0 mt-0.5" />
            <p>
              This security measure protects the site during maintenance. Only authorized administrators with the correct keyword can access the system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceKeywordPrompt;
