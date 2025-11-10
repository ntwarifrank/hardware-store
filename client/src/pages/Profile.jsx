import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import ReCAPTCHA from 'react-google-recaptcha';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Camera, 
  Edit2, 
  Save, 
  X,
  Lock,
  Bell,
  Package,
  Heart,
  Clock,
  Settings,
  LogOut,
  Upload,
  CheckCircle
} from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  const recaptchaRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.avatar?.url || null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || 'Rwanda',
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      // Store in localStorage for demo
      localStorage.setItem('userAvatar', reader.result);
      setTimeout(() => {
        setUploadingImage(false);
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // Save to localStorage for demo
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('userProfile', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const formatMemberDate = () => {
    if (user?.createdAt) {
      const date = new Date(user.createdAt);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
    }
    // Fallback to current date if no valid date
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Account</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              {/* Profile Summary */}
              <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold overflow-hidden border-4 border-white/30">
                    {uploadingImage ? (
                      <div className="w-full h-full flex items-center justify-center bg-orange-600">
                        <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : imagePreview ? (
                      <img src={imagePreview} alt={user?.name} className="w-full h-full object-cover" />
                    ) : user?.avatar?.url ? (
                      <img src={user.avatar.url} alt={user?.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="absolute bottom-0 right-0 p-2 bg-white text-orange-600 rounded-full shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                    title="Upload profile picture"
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <h3 className="mt-4 text-xl font-bold">{formData.name || user?.name}</h3>
                <p className="text-orange-100 text-sm">{formData.email || user?.email}</p>
                {user?.role === 'admin' && (
                  <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-yellow-400 text-gray-900 rounded-full text-xs font-semibold">
                    <Shield size={12} />
                    Admin
                  </div>
                )}
              </div>

              {/* Navigation Tabs */}
              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all mt-2"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        <Edit2 size={18} />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          <Save size={18} />
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          <X size={18} />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          Full Name
                        </div>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <Mail size={16} />
                          Email Address
                        </div>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <Phone size={16} />
                          Phone Number
                        </div>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          Address
                        </div>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Street address"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="City"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      >
                        <option value="Rwanda">Rwanda</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Burundi">Burundi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <Shield size={16} />
                          Account Role
                        </div>
                      </label>
                      <input
                        type="text"
                        value={user?.role?.toUpperCase()}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white bg-gray-100 dark:bg-gray-800 capitalize font-semibold"
                      />
                    </div>
                  </div>

                  {/* Account Stats */}
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                            <Package size={24} className="text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg">
                            <Heart size={24} className="text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Wishlist Items</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-primary-100 dark:bg-primary-900/40 rounded-lg">
                            <Clock size={24} className="text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{formatMemberDate()}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order History</h2>
                  <div className="text-center py-12">
                    <Package size={64} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">No orders yet</p>
                    <p className="text-gray-500 dark:text-gray-500 mt-2">Start shopping to see your orders here</p>
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Wishlist</h2>
                  <div className="text-center py-12">
                    <Heart size={64} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Your wishlist is empty</p>
                    <p className="text-gray-500 dark:text-gray-500 mt-2">Add items you love to your wishlist</p>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Addresses</h2>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                      <MapPin size={18} />
                      Add Address
                    </button>
                  </div>
                  <div className="text-center py-12">
                    <MapPin size={64} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">No saved addresses</p>
                    <p className="text-gray-500 dark:text-gray-500 mt-2">Add your delivery addresses for faster checkout</p>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">Update your password regularly to keep your account secure</p>
                        </div>
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                          <Lock size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">Add an extra layer of security to your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Delete Account Section */}
                    <div className="p-6 border-2 border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/10">
                      <div>
                        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                          <X size={20} />
                          Delete Account
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <div className="mt-4 space-y-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Before you delete:</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                              <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>All your order history will be permanently deleted</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Your wishlist and saved addresses will be removed</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>You will lose access to all pending orders</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>This action is irreversible</span>
                              </li>
                            </ul>
                          </div>

                          {/* reCAPTCHA v2 Security Verification */}
                          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                              <Shield size={16} />
                              🔒 Security verification required
                            </p>
                            
                            {import.meta.env.VITE_RECAPTCHA_SITE_KEY ? (
                              <div className="flex flex-col items-center gap-2">
                                <ReCAPTCHA
                                  ref={recaptchaRef}
                                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                  onChange={(token) => {
                                    setCaptchaToken(token);
                                    console.log('✅ reCAPTCHA verified');
                                  }}
                                  onExpired={() => {
                                    setCaptchaToken(null);
                                    console.warn('⏰ reCAPTCHA expired');
                                  }}
                                  onErrored={() => {
                                    setCaptchaToken(null);
                                    console.error('❌ reCAPTCHA error');
                                  }}
                                  theme="light"
                                />
                                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                  ⚠️ If you see "localhost not supported" error:
                                  <br />
                                  Add <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">localhost</code> to your reCAPTCHA domains at{' '}
                                  <a 
                                    href="https://www.google.com/recaptcha/admin" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:underline"
                                  >
                                    Google reCAPTCHA Admin
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded p-3 text-center">
                                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                  ⚠️ reCAPTCHA not configured
                                </p>
                                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                  Set VITE_RECAPTCHA_SITE_KEY in .env file
                                </p>
                              </div>
                            )}
                          </div>

                          <button 
                            onClick={() => {
                              // Check reCAPTCHA first
                              if (!captchaToken) {
                                alert('🔒 Please complete the reCAPTCHA security verification first');
                                return;
                              }

                              const confirmed = window.confirm(
                                '⚠️ FINAL WARNING\n\n' +
                                'Are you absolutely sure you want to delete your account?\n\n' +
                                'This will:\n' +
                                '• Permanently delete all your data\n' +
                                '• Cancel all pending orders\n' +
                                '• Remove all saved information\n\n' +
                                'Type "DELETE" in the next prompt to confirm.'
                              );
                              
                              if (confirmed) {
                                const confirmText = prompt('Type "DELETE" to confirm account deletion:');
                                if (confirmText === 'DELETE') {
                                  // TODO: Add API call to delete account with captcha token
                                  console.log('✅ Account deletion confirmed with captcha:', captchaToken);
                                  alert('✅ Account deletion request verified!\n\nBackend API will be implemented to process deletion.');
                                  
                                  // Reset captcha after use
                                  if (recaptchaRef.current) {
                                    recaptchaRef.current.reset();
                                  }
                                  setCaptchaToken(null);
                                  
                                  // dispatch(deleteAccount({ captchaToken }))
                                } else {
                                  alert('❌ Account deletion cancelled - confirmation text did not match');
                                  // Reset captcha
                                  if (recaptchaRef.current) {
                                    recaptchaRef.current.reset();
                                  }
                                  setCaptchaToken(null);
                                }
                              } else {
                                // Reset captcha if user cancelled
                                if (recaptchaRef.current) {
                                  recaptchaRef.current.reset();
                                }
                                setCaptchaToken(null);
                              }
                            }}
                            disabled={!captchaToken}
                            className={`w-full px-6 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${
                              captchaToken 
                                ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer' 
                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            }`}
                          >
                            <X size={20} />
                            {captchaToken ? 'Delete My Account Permanently' : '🔒 Complete Security Check First'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Notifications</h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">Receive updates about your orders and promotions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Marketing Emails</h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">Get notified about special offers and deals</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
