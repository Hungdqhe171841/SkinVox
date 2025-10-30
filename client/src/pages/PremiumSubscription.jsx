import { useState, useEffect } from 'react';
import { Crown, Check, Upload, X, Calendar, DollarSign } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PremiumSubscription = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [premiumStatus, setPremiumStatus] = useState(null);
  const [mySubscriptions, setMySubscriptions] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadPlans();
    loadPremiumStatus();
    loadMySubscriptions();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/premium/plans`);
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const loadPremiumStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_URL}/api/premium/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPremiumStatus(response.data);
    } catch (error) {
      console.error('Error loading premium status:', error);
    }
  };

  const loadMySubscriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_URL}/api/premium/my-subscriptions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMySubscriptions(response.data.subscriptions || []);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  };

  const handleSelectPlan = (plan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setSelectedPlan(plan);
    setShowPaymentModal(true);
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setPaymentProof(file);
      setPaymentProofPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    
    if (!paymentProof) {
      setError('Please upload payment proof');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('plan', selectedPlan.id);
      formData.append('paymentProof', paymentProof);
      formData.append('transactionId', transactionId);
      formData.append('notes', notes);

      const response = await axios.post(
        `${API_URL}/api/premium/subscribe`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSuccess(response.data.message);
      setTimeout(() => {
        setShowPaymentModal(false);
        loadMySubscriptions();
        loadPremiumStatus();
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit payment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-gray-600">
            Unlock unlimited AR makeup colors and exclusive features
          </p>
        </div>

        {/* Premium Status */}
        {premiumStatus?.isPremium && (
          <div className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">Premium Member</h3>
                </div>
                <p className="text-purple-100">
                  {premiumStatus.daysRemaining} days remaining
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-100">Expires on</p>
                <p className="text-lg font-semibold">
                  {new Date(premiumStatus.premiumExpiresAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Single Premium Plan */}
        <div className="max-w-md mx-auto mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-purple-500 relative overflow-hidden"
            >
              {/* Popular Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                MOST POPULAR
              </div>
              
              <div className="text-center mb-6">
                <Crown className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Premium Monthly
                </h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-purple-600">
                    25,000₫
                  </span>
                  <span className="text-gray-600 text-xl ml-2">
                    / tháng
                  </span>
                </div>
                <p className="text-gray-600">Chỉ 833₫ mỗi ngày!</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-1">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 flex-1">
                    <strong>Unlimited AR Colors</strong> - Try all makeup shades
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-1">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 flex-1">
                    <strong>AI ChatBot</strong> - 24/7 beauty consultation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-1">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 flex-1">
                    <strong>Priority Support</strong> - Fast response time
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-1">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 flex-1">
                    <strong>Ad-Free Experience</strong> - Enjoy without interruption
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-1">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 flex-1">
                    <strong>Exclusive Content</strong> - Early access to new features
                  </span>
                </li>
              </ul>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={premiumStatus?.isPremium}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  premiumStatus?.isPremium
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                }`}
              >
                {premiumStatus?.isPremium ? '✓ Already Premium' : 'Upgrade Now'}
              </button>
              
              {!premiumStatus?.isPremium && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  🔒 Cancel anytime • No hidden fees
                </p>
              )}
            </div>
          ))}
        </div>

        {/* My Subscriptions */}
        {mySubscriptions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              My Subscription History
            </h2>
            <div className="space-y-4">
              {mySubscriptions.map((sub) => (
                <div
                  key={sub._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {sub.plan.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(sub.status)}`}>
                          {sub.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>
                            {new Intl.NumberFormat('vi-VN', { 
                              style: 'currency', 
                              currency: 'VND' 
                            }).format(sub.amount)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(sub.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                      {sub.rejectionReason && (
                        <p className="mt-2 text-sm text-red-600">
                          Reason: {sub.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Complete Payment
                  </h2>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* QR Code Section */}
                <div className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-center">
                    Scan QR Code to Pay
                  </h3>
                  <div className="bg-white p-4 rounded-lg inline-block mx-auto block">
                    {/* Replace this with your actual QR code */}
                    <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                      <p className="text-gray-500 text-center px-4">
                        QR Code will appear here<br/>
                        <span className="text-sm">
                          Amount: {selectedPlan?.amountFormatted}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Bank: <strong>MB Bank</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Account: <strong>0123456789</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Name: <strong>SKINVOX COMPANY</strong>
                    </p>
                  </div>
                </div>

                {/* Upload Form */}
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="p-4 bg-green-50 text-green-600 rounded-lg">
                      {success}
                    </div>
                  )}

                  {/* Upload Payment Proof */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Payment Screenshot *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="payment-proof"
                        required
                      />
                      <label
                        htmlFor="payment-proof"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        {paymentProofPreview ? (
                          <img
                            src={paymentProofPreview}
                            alt="Payment proof preview"
                            className="max-h-48 rounded-lg mb-2"
                          />
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600">
                              Click to upload payment screenshot
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Transaction ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter transaction ID if available"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Any additional notes..."
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Submit for Review'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumSubscription;

