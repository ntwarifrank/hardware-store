import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { Loader2, CheckCircle, XCircle, Clock, Smartphone } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

const PaymentProcessing = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [status, setStatus] = useState('INITIATING'); // INITIATING, PENDING, PROCESSING, COMPLETED, FAILED, TIMEOUT
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes

  useEffect(() => {
    if (!orderId) {
      navigate('/orders');
      return;
    }

    initiatePayment();
  }, [orderId]);

  // Countdown timer
  useEffect(() => {
    if (status === 'PENDING' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, timeRemaining]);

  // Progress bar animation
  useEffect(() => {
    if (status === 'PENDING' || status === 'PROCESSING') {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + 1;
        });
      }, 500);

      return () => clearInterval(timer);
    }
  }, [status]);

  const initiatePayment = async () => {
    try {
      setStatus('INITIATING');
      setProgress(10);

      // Get order details first
      const orderResponse = await axiosClient.get(`/orders/${orderId}`);
      setOrder(orderResponse.data.data.order);

      setProgress(30);

      // Initiate payment
      const response = await axiosClient.post('/payments/realtime/initiate', {
        orderId,
      });

      if (response.data.success) {
        setStatus('PENDING');
        setProgress(50);
        
        // Start polling for status
        startStatusPolling();
      }
    } catch (err) {
      console.error('Payment initiation failed:', err);
      setError(err.response?.data?.message || 'Failed to initiate payment');
      setStatus('FAILED');
    }
  };

  const startStatusPolling = () => {
    let attempts = 0;
    const maxAttempts = 36; // 3 minutes with 5-second intervals

    const pollInterval = setInterval(async () => {
      attempts++;

      if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        setStatus('TIMEOUT');
        setError('Payment request timed out. Please try again.');
        return;
      }

      try {
        setStatus('PROCESSING');
        const response = await axiosClient.get(`/payments/realtime/status/${orderId}`);
        const paymentStatus = response.data.data.status;

        if (paymentStatus === 'COMPLETED') {
          clearInterval(pollInterval);
          setStatus('COMPLETED');
          setProgress(100);
          
          // Redirect to order details after 2 seconds
          setTimeout(() => {
            navigate(`/orders/${orderId}`);
          }, 2000);
        } else if (paymentStatus === 'FAILED') {
          clearInterval(pollInterval);
          setStatus('FAILED');
          setError('Payment was declined. Please try again.');
        }
      } catch (err) {
        console.error('Status check failed:', err);
        // Continue polling unless max attempts reached
      }
    }, 5000); // Check every 5 seconds
  };

  const handleCancel = async () => {
    try {
      await axiosClient.post('/payments/realtime/cancel', { orderId });
      navigate('/orders');
    } catch (err) {
      console.error('Failed to cancel payment:', err);
    }
  };

  const handleRetry = () => {
    setError('');
    setProgress(0);
    setTimeRemaining(180);
    initiatePayment();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Payment Status Card */}
        <div className="card text-center">
          {/* Status Icon */}
          <div className="mb-6">
            {status === 'INITIATING' && (
              <Loader2 className="w-16 h-16 mx-auto text-primary-600 animate-spin" />
            )}
            {(status === 'PENDING' || status === 'PROCESSING') && (
              <div className="relative">
                <Smartphone className="w-16 h-16 mx-auto text-yellow-500 animate-pulse" />
                <div className="absolute -top-2 -right-2">
                  <Clock className="w-8 h-8 text-primary-600 animate-pulse" />
                </div>
              </div>
            )}
            {status === 'COMPLETED' && (
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            )}
            {(status === 'FAILED' || status === 'TIMEOUT') && (
              <XCircle className="w-16 h-16 mx-auto text-red-500" />
            )}
          </div>

          {/* Status Message */}
          <div className="mb-6">
            {status === 'INITIATING' && (
              <>
                <h2 className="text-2xl font-bold mb-2">Initiating Payment</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Setting up your payment request...
                </p>
              </>
            )}

            {status === 'PENDING' && (
              <>
                <h2 className="text-2xl font-bold mb-2">Check Your Phone</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  A payment prompt has been sent to your phone. Please check your mobile money account and authorize the payment.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </>
            )}

            {status === 'PROCESSING' && (
              <>
                <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Verifying your payment...
                </p>
              </>
            )}

            {status === 'COMPLETED' && (
              <>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Your payment has been confirmed. Redirecting to order details...
                </p>
              </>
            )}

            {status === 'FAILED' && (
              <>
                <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
                <p className="text-red-600 dark:text-red-400">
                  {error || 'Payment was not successful. Please try again.'}
                </p>
              </>
            )}

            {status === 'TIMEOUT' && (
              <>
                <h2 className="text-2xl font-bold text-orange-600 mb-2">Payment Timed Out</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {error || 'Payment request expired. Please try again.'}
                </p>
              </>
            )}
          </div>

          {/* Progress Bar */}
          {(status === 'INITIATING' || status === 'PENDING' || status === 'PROCESSING') && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary-600 h-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Order Details */}
          {order && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order Number:</span>
                  <span className="font-semibold">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-bold text-primary-600">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                  <span className="font-semibold">
                    {order.paymentInfo.provider === 'mtn_mobile_money' ? 'MTN Mobile Money' : 'Airtel Money'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {(status === 'PENDING' || status === 'PROCESSING') && (
              <button
                onClick={handleCancel}
                className="btn btn-outline"
              >
                Cancel Payment
              </button>
            )}

            {(status === 'FAILED' || status === 'TIMEOUT') && (
              <>
                <button
                  onClick={handleRetry}
                  className="btn btn-primary"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/orders')}
                  className="btn btn-outline"
                >
                  View Orders
                </button>
              </>
            )}

            {status === 'COMPLETED' && (
              <button
                onClick={() => navigate(`/orders/${orderId}`)}
                className="btn btn-primary"
              >
                View Order Details
              </button>
            )}
          </div>

          {/* Help Text */}
          {status === 'PENDING' && (
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                <strong>Having trouble?</strong><br />
                Make sure your phone number is correct and your mobile money account has sufficient balance.
              </p>
            </div>
          )}
        </div>

        {/* Security Badge */}
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>🔒 Secure payment processing</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;
