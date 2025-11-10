import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { addToCart } from '../features/cart/cartSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { Heart, ShoppingCart, Trash2, HeartOff } from 'lucide-react';
import Loader from '../components/Loader';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <HeartOff className="mx-auto mb-4 text-gray-400" size={64} />
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Save your favorite products for later!
          </p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-red-500" size={32} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Wishlist ({items.length} items)
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item._id} className="card group relative">
              {/* Remove Button */}
              <button
                onClick={() => handleRemove(item._id)}
                className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                title="Remove from wishlist"
              >
                <Trash2 size={18} className="text-red-600" />
              </button>

              {/* Product Image */}
              <Link to={`/products/${item._id}`} className="block mb-4">
                <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  <img
                    src={item.images?.[0]?.url || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="badge badge-danger">Out of Stock</span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="flex-1">
                <Link
                  to={`/products/${item._id}`}
                  className="font-semibold text-lg hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2 mb-2"
                >
                  {item.name}
                </Link>

                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                  {item.description}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(item.price)}
                  </span>
                  {item.comparePrice && item.comparePrice > item.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatCurrency(item.comparePrice)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                {item.stock > 0 ? (
                  <span className="badge badge-success mb-3">In Stock</span>
                ) : (
                  <span className="badge badge-danger mb-3">Out of Stock</span>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(item._id)}
                  disabled={item.stock === 0}
                  className="w-full btn btn-primary flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
