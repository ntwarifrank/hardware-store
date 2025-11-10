import { useSelector } from 'react-redux';

/**
 * Custom hook to access wishlist state
 */
export const useWishlist = () => {
  const { items, isLoading } = useSelector((state) => state.wishlist);

  return {
    items,
    isLoading,
  };
};
