import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, verifyOTP, resendOTP, clearError, resetOTPState } from '../features/auth/authSlice';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Lock, Eye, EyeOff, Shield, AlertCircle, FileText } from 'lucide-react';
import Loader from '../components/Loader';
import PasswordStrength from '../components/PasswordStrength';
import { validateName, validateEmail, validatePassword } from '../utils/validation';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useAuth();
  const { tempUserId, pendingEmail, awaitingOTP } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear error when user starts typing
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000); // Auto-clear after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    // Clean up OTP state when component unmounts
    return () => {
      dispatch(resetOTPState());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    // Clear error when user starts typing
    if (error) {
      dispatch(clearError());
    }
    
    setFormData({
      ...formData,
      [name]: fieldValue,
    });

    // Real-time validation
    if (touched[name]) {
      validateField(name, fieldValue);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let result;
    const errors = { ...fieldErrors };

    switch (field) {
      case 'name':
        result = validateName(value);
        break;
      case 'email':
        result = validateEmail(value);
        break;
      case 'password':
        result = validatePassword(value);
        break;
      case 'confirmPassword':
        result = {
          isValid: value === formData.password,
          errors: value === formData.password ? [] : ['Passwords do not match'],
        };
        break;
      case 'acceptedTerms':
        result = {
          isValid: value === true,
          errors: value === true ? [] : ['You must accept the terms and conditions'],
        };
        break;
      default:
        return;
    }

    if (result.isValid) {
      delete errors[field];
    } else {
      errors[field] = result.errors[0]; // Show first error only
    }

    setFieldErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptedTerms: true,
    });

    // Validate all fields
    const nameResult = validateName(formData.name);
    const emailResult = validateEmail(formData.email);
    const passwordResult = validatePassword(formData.password);
    const confirmResult = {
      isValid: formData.password === formData.confirmPassword,
      errors: formData.password === formData.confirmPassword ? [] : ['Passwords do not match'],
    };
    const termsResult = {
      isValid: formData.acceptedTerms === true,
      errors: formData.acceptedTerms === true ? [] : ['You must accept the terms and conditions'],
    };

    const errors = {};
    if (!nameResult.isValid) errors.name = nameResult.errors[0];
    if (!emailResult.isValid) errors.email = emailResult.errors[0];
    if (!passwordResult.isValid) errors.password = passwordResult.errors[0];
    if (!confirmResult.isValid) errors.confirmPassword = confirmResult.errors[0];
    if (!termsResult.isValid) errors.acceptedTerms = termsResult.errors[0];

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        acceptedTerms: formData.acceptedTerms,
      };
      
      await dispatch(register(payload)).unwrap();
      // Registration successful, OTP form will be shown
    } catch (error) {
      // Error is stored in Redux and displayed
      // Don't navigate or refresh on error
      console.log('Registration failed:', error);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      return;
    }

    try {
      const result = await dispatch(verifyOTP({ tempUserId, otp })).unwrap();
      // Only navigate on successful verification
      if (result) {
        navigate('/');
      }
    } catch (error) {
      // Error is displayed, don't navigate
      console.log('OTP verification failed:', error);
    }
  };

  const handleResendOTP = async () => {
    try {
      await dispatch(resendOTP(tempUserId)).unwrap();
    } catch (error) {
      // Error handled by useEffect
    }
  };

  // Show OTP verification form if awaiting OTP
  if (awaitingOTP) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="card">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Verify Your Email
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                We've sent a 6-digit code to
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {pendingEmail}
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {/* Error Message for OTP */}
              {error && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-l-4 border-red-500 rounded-xl shadow-md animate-shake backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-red-800 dark:text-red-200 font-medium leading-relaxed">
                        {error}
                      </p>
                    </div>
                    <button
                      onClick={() => dispatch(clearError())}
                      className="flex-shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                      aria-label="Close error"
                      type="button"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Code expires in 10 minutes
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full btn btn-primary flex items-center justify-center"
              >
                {isLoading ? <Loader size="sm" /> : 'Verify Email'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
                >
                  Resend Code
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => dispatch(resetOTPState())}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Back to Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
          {/* Logo/Icon Section */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-primary-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-primary-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Join BuildMart - It only takes a minute
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-l-4 border-red-500 rounded-xl shadow-md animate-shake backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-red-800 dark:text-red-200 font-medium leading-relaxed">
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={() => dispatch(clearError())}
                    className="flex-shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                    aria-label="Close error"
                    type="button"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  className={`input pl-10 ${fieldErrors.name && touched.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="John Doe"
                  required
                />
              </div>
              {fieldErrors.name && touched.name && (
                <div className="mt-1 flex items-start text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                  <span>{fieldErrors.name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  className={`input pl-10 ${fieldErrors.email && touched.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="you@example.com"
                  required
                />
              </div>
              {fieldErrors.email && touched.email && (
                <div className="mt-1 flex items-start text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                  <span>{fieldErrors.email}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  className={`input pl-10 pr-10 ${fieldErrors.password && touched.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.password && <PasswordStrength password={formData.password} />}
              {fieldErrors.password && touched.password && (
                <div className="mt-1 flex items-start text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                  <span>{fieldErrors.password}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`input pl-10 ${fieldErrors.confirmPassword && touched.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="••••••••"
                  required
                />
              </div>
              {fieldErrors.confirmPassword && touched.confirmPassword && (
                <div className="mt-1 flex items-start text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                  <span>{fieldErrors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    name="acceptedTerms"
                    checked={formData.acceptedTerms}
                    onChange={handleChange}
                    onBlur={() => handleBlur('acceptedTerms')}
                    className={`w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${
                      fieldErrors.acceptedTerms && touched.acceptedTerms ? 'border-red-500' : ''
                    }`}
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptedTerms" className="text-gray-700 dark:text-gray-300">
                    I agree to the{' '}
                    <Link
                      to="/terms-conditions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Terms and Conditions
                    </Link>
                    {' '}and{' '}
                    <Link
                      to="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
              {fieldErrors.acceptedTerms && touched.acceptedTerms && (
                <div className="mt-2 flex items-start text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                  <span>{fieldErrors.acceptedTerms}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader size="sm" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
