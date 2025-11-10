import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { formatCurrency, calculateDiscount } from '../utils/formatCurrency';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, isInWishlist = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const discount = calculateDiscount(product.comparePrice, product.price);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col relative border border-gray-100 dark:border-gray-700"
    >
      {/* Discount Badge - Top Left Corner */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 z-20 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow-lg">
          -{discount}% OFF
        </div>
      )}

      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
        <img
          src={product.images?.[0]?.url || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Heart and Eye Icons - Overlaid on Image */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${isInWishlist
                ? 'bg-red-500 text-white scale-110'
                : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white hover:scale-110'
              }`}
          >
            <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} strokeWidth={2} />
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-orange-500 hover:text-white hover:scale-110 transition-all duration-300"
          >
            <Eye size={16} className="text-gray-600 dark:text-gray-300 group-hover:text-current" strokeWidth={2} />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 flex flex-col gap-2 border-t border-gray-100 dark:border-gray-700">
        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-md">
            <div className="w-4 h-4 rounded-full bg-orange-500/20 dark:bg-orange-500/30 flex items-center justify-center">
              <span className="text-[9px] font-bold text-orange-600 dark:text-orange-400">
                {product.category?.name?.[0]?.toUpperCase() || 'B'}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">
              {product.category?.name || 'Hardware'}
            </span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight min-h-[2.5rem] group-hover:text-orange-500 transition-colors">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base sm:text-lg font-bold text-orange-500 dark:text-orange-400">
            {formatCurrency(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 line-through">
              {formatCurrency(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Rating, Stock and Cart Button */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col gap-1">
            {/* Stock Status */}
            <span className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">
              {product.stock > 0 ? (
                <span className="text-green-600 dark:text-green-400">● {product.stock} in stock</span>
              ) : (
                <span className="text-red-600 dark:text-red-400">● Out of stock</span>
              )}
            </span>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={`${i < Math.floor(product.averageRating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'
                      }`}
                  />
                ))}
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">
                ({product.numReviews || 0})
              </span>
            </div>
          </div>

          {/* Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="p-2.5 sm:p-3 bg-gray-900 dark:bg-gray-700 text-white rounded-full shadow-lg hover:bg-orange-500 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;