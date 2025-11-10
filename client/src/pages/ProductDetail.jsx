import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { addToCart } from '../features/cart/cartSlice';
import { addToWishlist } from '../features/wishlist/wishlistSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { useAuth } from '../hooks/useAuth';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  
  // Placeholder image for products
  const placeholderImage = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=800&fit=crop';

  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await axiosClient.get(`/products/${id}`);
      return response.data.data.product;
    },
  });

  // Fetch related products
  const { data: relatedProducts } = useQuery({
    queryKey: ['relatedProducts', product?.category?._id],
    queryFn: async () => {
      if (!product?.category?._id) return [];
      const response = await axiosClient.get(`/products?category=${product.category._id}&limit=9`);
      return response.data.data.products.filter(p => p._id !== id);
    },
    enabled: !!product?.category?._id,
  });

  // Fetch reviews
  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const response = await axiosClient.get(`/reviews/product/${id}`);
      return response.data.data.reviews;
    },
  });

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Instant feedback with optimistic update!
    dispatch(addToCart({ productId: id, quantity }))
      .unwrap()
      .then(() => {
        // Show brief success message (optional - can add toast library)
        console.log('✅ Added to cart successfully!');
      })
      .catch((error) => {
        console.error('Failed to add to cart:', error);
        alert('Failed to add item to cart. Please try again.');
      });
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToWishlist(true);
    try {
      await dispatch(addToWishlist(id)).unwrap();
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    } finally {
      setAddingToWishlist(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!reviewData.comment.trim()) {
      alert('Please provide a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      await axiosClient.post('/reviews', {
        product: id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      
      setReviewData({ rating: 5, comment: '' });
      setShowReviewForm(false);
      refetchReviews();
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert(error.response?.data?.message || 'Failed to submit review. You may have already reviewed this product.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm">
          <button onClick={() => navigate('/')} className="text-gray-500 dark:text-gray-400 hover:text-primary-600">
            Home
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <button onClick={() => navigate('/products')} className="text-gray-500 dark:text-gray-400 hover:text-primary-600">
            Electronics
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mb-12 bg-white dark:bg-gray-800 rounded-2xl p-6">
          {/* Product Images */}
          <div className="flex gap-4">
            {/* Thumbnail Images - Left Side */}
            {product.images?.length > 1 && (
              <div className="flex flex-col gap-3 w-24">
                {product.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setImageError(false);
                    }}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-orange-500 shadow-md' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                    }`}
                  >
                    <div className="w-full h-full bg-gray-50 dark:bg-gray-700/30 flex items-center justify-center p-2">
                      <img 
                        src={image.url || placeholderImage}
                        alt={`View ${index + 1}`} 
                        className="w-full h-full object-contain rounded-xl"
                        onError={(e) => { e.target.src = placeholderImage; }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 relative bg-gray-50 dark:bg-gray-700/30 rounded-2xl overflow-hidden">
              <div className="aspect-square flex items-center justify-center p-8">
                <img
                  src={!imageError && product.images?.[selectedImage]?.url ? product.images[selectedImage].url : placeholderImage}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-2xl"
                  onError={() => setImageError(true)}
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.averageRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300 dark:text-gray-600 dark:fill-gray-600'}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {product.averageRating > 0 ? product.averageRating.toFixed(1) : '0.0'}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications Table */}
            <div className="mb-6">
              <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {product.brand && (
                      <tr className="border-b dark:border-gray-700">
                        <td className="py-2 px-4 bg-gray-50 dark:bg-gray-700/50 font-medium text-gray-700 dark:text-gray-300">Brand</td>
                        <td className="py-2 px-4 text-gray-900 dark:text-white">{product.brand}</td>
                      </tr>
                    )}
                    {product.sku && (
                      <tr className="border-b dark:border-gray-700">
                        <td className="py-2 px-4 bg-gray-50 dark:bg-gray-700/50 font-medium text-gray-700 dark:text-gray-300">SKU</td>
                        <td className="py-2 px-4 text-gray-900 dark:text-white">{product.sku}</td>
                      </tr>
                    )}
                    {product.weight?.value && (
                      <tr className="border-b dark:border-gray-700">
                        <td className="py-2 px-4 bg-gray-50 dark:bg-gray-700/50 font-medium text-gray-700 dark:text-gray-300">Weight</td>
                        <td className="py-2 px-4 text-gray-900 dark:text-white">
                          {product.weight.value} {product.weight.unit}
                        </td>
                      </tr>
                    )}
                    {product.dimensions?.length && product.dimensions?.width && product.dimensions?.height && (
                      <tr className="border-b dark:border-gray-700">
                        <td className="py-2 px-4 bg-gray-50 dark:bg-gray-700/50 font-medium text-gray-700 dark:text-gray-300">Dimensions</td>
                        <td className="py-2 px-4 text-gray-900 dark:text-white">
                          {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} {product.dimensions.unit}
                        </td>
                      </tr>
                    )}
                    {product.category?.name && (
                      <tr className="border-b dark:border-gray-700">
                        <td className="py-2 px-4 bg-gray-50 dark:bg-gray-700/50 font-medium text-gray-700 dark:text-gray-300">Category</td>
                        <td className="py-2 px-4 text-gray-900 dark:text-white">{product.category.name}</td>
                      </tr>
                    )}
                    {product.specifications && Object.keys(product.specifications).length > 0 && 
                      Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key} className="border-b dark:border-gray-700">
                          <td className="py-2 px-4 bg-gray-50 dark:bg-gray-700/50 font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {key.replace(/_/g, ' ')}
                          </td>
                          <td className="py-2 px-4 text-gray-900 dark:text-white">{value}</td>
                        </tr>
                      ))
                    }
                    <tr>
                      <td className="py-2 px-4 bg-gray-50 dark:bg-gray-700/50 font-medium text-gray-700 dark:text-gray-300">Stock Status</td>
                      <td className="py-2 px-4">
                        <span className={`font-medium ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">About this item</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Price and Actions */}
            <div className="border-t dark:border-gray-700 pt-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-orange-500 dark:text-orange-400">
                  {formatCurrency(product.price)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-lg text-gray-400 dark:text-gray-500 line-through">
                    {formatCurrency(product.comparePrice)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={handleAddToWishlist}
                  disabled={addingToWishlist}
                  className="p-3 border-2 border-gray-300 dark:border-gray-600 hover:border-orange-500 dark:hover:border-orange-500 rounded-lg transition-colors"
                  title="Add to Wishlist"
                >
                  {addingToWishlist ? (
                    <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Heart size={20} className="text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Customer Reviews ({reviews?.length || 0})
            </h2>
            {isAuthenticated && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Write a Review
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-4 border dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Write Your Review</h3>
              
              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating })}
                      className="focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={`${
                          rating <= reviewData.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Share your experience with this product..."
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewData({ rating: 5, comment: '' });
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          {reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b dark:border-gray-700 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {review.user?.name || 'Anonymous'}
                        </span>
                        {review.isVerifiedPurchase && (
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>

        {/* You May Also Like Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {relatedProducts.slice(0, 10).map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
