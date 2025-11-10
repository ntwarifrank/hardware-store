import { useSelector } from 'react-redux';

/**
 * Custom hook to access cart state
 */
export const useCart = () => {
  const { items, totalItems, totalPrice, isLoading } = useSelector((state) => state.cart);

  return {
    items,
    totalItems,
    totalPrice,
    isLoading,
  };
};
