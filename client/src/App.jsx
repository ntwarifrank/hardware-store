import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './app/store';
import AppRoutes from './routes/AppRoutes';
import { useSelector } from 'react-redux';
import { useMaintenanceMode, isAdmin } from './hooks/useMaintenanceMode';
import MaintenanceMode from './components/MaintenanceMode';
import AdminMaintenanceBanner from './components/AdminMaintenanceBanner';
import MaintenanceKeywordPrompt from './components/MaintenanceKeywordPrompt';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Theme initializer component
const ThemeInitializer = () => {
  const theme = useSelector((state) => state.theme?.theme || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return null;
};

// Check if bypass keyword is valid
const hasValidBypass = () => {
  try {
    const keyword = sessionStorage.getItem('maintenanceBypass');
    const bypassTime = sessionStorage.getItem('bypassTime');
    
    // Check if keyword exists and is correct
    if (keyword !== 'UGWANEZAV2020') {
      return false;
    }
    
    // Check if bypass is still valid (24 hour expiry)
    if (bypassTime) {
      const elapsed = Date.now() - parseInt(bypassTime);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (elapsed > twentyFourHours) {
        // Expired, clear it
        sessionStorage.removeItem('maintenanceBypass');
        sessionStorage.removeItem('bypassTime');
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
};

// Maintenance mode wrapper
const MaintenanceModeWrapper = ({ children }) => {
  const { isMaintenanceMode } = useMaintenanceMode();
  const userIsAdmin = isAdmin();
  const [showKeywordPrompt, setShowKeywordPrompt] = useState(false);
  const [bypassGranted, setBypassGranted] = useState(false);

  // Check bypass status on mount and when maintenance mode changes
  useEffect(() => {
    console.log('🔧 Maintenance Check:', { isMaintenanceMode, userIsAdmin });
    
    if (isMaintenanceMode) {
      const hasValidBypassKeyword = hasValidBypass();
      setBypassGranted(hasValidBypassKeyword);
      
      console.log('🔑 Bypass Status:', { userIsAdmin, hasValidBypassKeyword });
      
      // If user is admin but no bypass keyword, show prompt
      if (userIsAdmin && !hasValidBypassKeyword) {
        console.log('✅ Showing keyword prompt for admin');
        // Small delay to ensure maintenance page renders first
        setTimeout(() => {
          setShowKeywordPrompt(true);
          console.log('🚀 Keyword prompt state set to TRUE');
        }, 200);
      } else {
        setShowKeywordPrompt(false);
      }
    } else {
      setBypassGranted(false);
      setShowKeywordPrompt(false);
    }
  }, [isMaintenanceMode, userIsAdmin]);

  // Listen for admin button click
  useEffect(() => {
    const handleAdminPrompt = () => {
      console.log('🔘 Event received: showAdminPrompt');
      console.log('🔍 Current state:', { userIsAdmin, bypassGranted, isMaintenanceMode });
      
      // Always show prompt when button clicked - keyword validation handles security
      console.log('✅ Showing keyword prompt');
      setShowKeywordPrompt(true);
    };

    window.addEventListener('showAdminPrompt', handleAdminPrompt);
    return () => window.removeEventListener('showAdminPrompt', handleAdminPrompt);
  }, [userIsAdmin, bypassGranted, isMaintenanceMode]);

  // Handle successful keyword entry
  const handleCorrectKeyword = () => {
    setBypassGranted(true);
    setShowKeywordPrompt(false);
  };

  // If maintenance mode is OFF, show normal site
  if (!isMaintenanceMode) {
    return children;
  }

  // If maintenance mode is ON:
  
  // Case 1: User has valid bypass (entered correct keyword)
  if (bypassGranted) {
    console.log('✅ Bypass granted - showing site');
    return (
      <>
        <AdminMaintenanceBanner />
        {children}
      </>
    );
  }

  // Case 2: No bypass yet - show maintenance page with optional prompt
  console.log('📋 Rendering: Maintenance Page', { showKeywordPrompt });
  return (
    <>
      <MaintenanceMode />
      {showKeywordPrompt && (
        <MaintenanceKeywordPrompt onCorrectKeyword={handleCorrectKeyword} />
      )}
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeInitializer />
          <MaintenanceModeWrapper>
            <AppRoutes />
          </MaintenanceModeWrapper>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
