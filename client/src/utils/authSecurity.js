/**
 * Authentication Security Utilities
 * Enhanced security features for login/logout
 */

/**
 * Secure logout - Clear all authentication data
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} navigate - React Router navigate function
 */
export const secureLogout = (dispatch, navigate) => {
  // 1. Clear localStorage
  localStorage.clear();
  
  // 2. Clear sessionStorage
  sessionStorage.clear();
  
  // 3. Clear cookies
  clearAllCookies();
  
  // 4. Navigate to login
  if (navigate) {
    navigate('/login', { replace: true });
  }
  
  console.log('🔒 Secure logout completed');
};

/**
 * Clear all client-side cookies
 */
export const clearAllCookies = () => {
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true;
  }
};

/**
 * Get token expiry time
 * @param {string} token - JWT token
 * @returns {number|null} - Expiry timestamp or null
 */
export const getTokenExpiry = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error getting token expiry:', error);
    return null;
  }
};

/**
 * Auto-logout on token expiry
 * @param {string} token - JWT token
 * @param {Function} logoutCallback - Function to call on logout
 * @returns {number|null} - Timeout ID or null
 */
export const setupAutoLogout = (token, logoutCallback) => {
  if (!token) return null;
  
  const expiry = getTokenExpiry(token);
  if (!expiry) return null;
  
  const timeUntilExpiry = expiry - Date.now();
  
  if (timeUntilExpiry <= 0) {
    // Already expired
    logoutCallback();
    return null;
  }
  
  // Set timeout to auto-logout
  const timeoutId = setTimeout(() => {
    console.warn('⏰ Session expired - Auto logout');
    logoutCallback();
  }, timeUntilExpiry);
  
  return timeoutId;
};

/**
 * Validate session integrity
 * @returns {boolean} - True if session is valid
 */
export const validateSession = () => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('accessToken');
  
  if (!user || !token) {
    return false;
  }
  
  // Check token expiry
  if (isTokenExpired(token)) {
    console.warn('🔐 Token expired');
    return false;
  }
  
  return true;
};

/**
 * Secure session check - Run on app init
 * @param {Function} logoutCallback - Function to call if session invalid
 */
export const checkSessionSecurity = (logoutCallback) => {
  if (!validateSession()) {
    console.warn('🚫 Invalid session detected - Logging out');
    secureLogout(null, null);
    if (logoutCallback) {
      logoutCallback();
    }
  }
};

/**
 * Get device fingerprint for tracking
 * @returns {string} - Device fingerprint
 */
export const getDeviceFingerprint = () => {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;
  const screenRes = `${screen.width}x${screen.height}`;
  
  const fingerprint = `${ua}|${platform}|${language}|${screenRes}`;
  return btoa(fingerprint); // Base64 encode
};

/**
 * Log security event
 * @param {string} event - Event name
 * @param {object} details - Event details
 */
export const logSecurityEvent = (event, details = {}) => {
  const logEntry = {
    event,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    ...details
  };
  
  console.log(`🔒 Security Event: ${event}`, logEntry);
  
  // Store in sessionStorage for debugging (last 10 events)
  const logs = JSON.parse(sessionStorage.getItem('securityLogs') || '[]');
  logs.unshift(logEntry);
  sessionStorage.setItem('securityLogs', JSON.stringify(logs.slice(0, 10)));
};

export default {
  secureLogout,
  clearAllCookies,
  isTokenExpired,
  getTokenExpiry,
  setupAutoLogout,
  validateSession,
  checkSessionSecurity,
  getDeviceFingerprint,
  logSecurityEvent
};
