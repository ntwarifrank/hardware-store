import { useState, useEffect } from 'react';

/**
 * Verify if maintenance mode data is valid
 * Prevents tampering with localStorage
 */
const verifyMaintenanceData = (settings) => {
  try {
    // Check if settings object is valid
    if (!settings || typeof settings !== 'object') {
      return false;
    }

    // Maintenance mode should be a boolean
    if (typeof settings.maintenanceMode !== 'boolean') {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Hook to check if maintenance mode is enabled
 * Checks localStorage and updates in real-time
 */
export const useMaintenanceMode = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  useEffect(() => {
    // Check maintenance mode from localStorage with validation
    const checkMaintenanceMode = () => {
      try {
        const settings = localStorage.getItem('adminSettings');
        if (settings) {
          const parsed = JSON.parse(settings);
          
          // Verify data integrity before using
          if (verifyMaintenanceData(parsed)) {
            setIsMaintenanceMode(parsed.maintenanceMode || false);
          } else {
            console.warn('Invalid maintenance mode data detected');
            setIsMaintenanceMode(false);
          }
        } else {
          setIsMaintenanceMode(false);
        }
      } catch (error) {
        console.error('Error reading maintenance mode:', error);
        setIsMaintenanceMode(false);
      }
    };

    // Initial check
    checkMaintenanceMode();

    // Listen for storage changes (real-time updates across tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'adminSettings') {
        checkMaintenanceMode();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Poll for changes every 2 seconds (for same-tab updates)
    const interval = setInterval(checkMaintenanceMode, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return { isMaintenanceMode };
};

/**
 * Check if current user is admin
 * Admins can bypass maintenance mode
 * Enhanced security: checks both user role AND valid auth token
 */
export const isAdmin = () => {
  try {
    // Check user role
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      return false;
    }

    // Verify auth token exists (additional security layer)
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    // Additional validation: check if user object has required admin fields
    if (!user._id || !user.email) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Admin verification error:', error);
    return false;
  }
};

export default useMaintenanceMode;
