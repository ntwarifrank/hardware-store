import { useSelector } from 'react-redux';

/**
 * Custom hook to access auth state
 */
export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isAdmin: user?.role === 'admin',
  };
};

export default useAuth;
