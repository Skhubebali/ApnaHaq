import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../store/useStore';
import { Lock, Shield, Check } from 'lucide-react';

const SubscriptionPage = () => {
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('Monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token, user, setUser } = useStore();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(
        'http://localhost:5000/api/subscription/subscribe',
        { password, plan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setUser({ ...user, isSubscribed: true });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Lock className="h-16 w-16 text-india-saffron mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gov-blue mb-2">Unlock Full Access to ApnaHaq</h2>
          <p className="text-gray-600">Subscribe to view your personalized eligibility report and apply for schemes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <div className="space-y-4">
            <div 
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${plan === 'Monthly' ? 'border-gov-blue bg-blue-50' : 'border-gray-200 bg-white'}`}
              onClick={() => setPlan('Monthly')}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">Monthly Plan</h3>
                <div className="text-2xl font-bold text-gov-blue">₹99<span className="text-sm text-gray-500 font-normal">/mo</span></div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mt-4">
                <li className="flex items-center"><Check className="h-4 w-4 text-india-green mr-2" /> Full access to scheme database</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-india-green mr-2" /> Personalized AI Matching</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-india-green mr-2" /> Real-time scheme alerts</li>
              </ul>
            </div>

            <div 
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${plan === 'Yearly' ? 'border-gov-blue bg-blue-50' : 'border-gray-200 bg-white'}`}
              onClick={() => setPlan('Yearly')}
            >
              <div className="absolute top-0 right-0 bg-india-saffron text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-xl font-bold">SAVE 15%</div>
              <div className="flex justify-between items-center mb-2 relative">
                <h3 className="text-xl font-bold">Yearly Plan</h3>
                <div className="text-2xl font-bold text-gov-blue">₹999<span className="text-sm text-gray-500 font-normal">/yr</span></div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mt-4">
                <li className="flex items-center"><Check className="h-4 w-4 text-india-green mr-2" /> All Monthly Plan features</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-india-green mr-2" /> Priority support</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-india-green mr-2" /> Downloadable PDF reports</li>
              </ul>
            </div>
          </div>

          {/* Dummy Payment Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-center space-x-2 mb-6 text-gray-500">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wide">Secure Payment Verification</span>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
            
            <form onSubmit={handleSubscribe} className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verify Password</label>
                <input 
                  type="password" 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gov-blue focus:border-gov-blue bg-gray-50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password to authorize"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 mt-6">
                <div className="flex justify-between items-center mb-4 font-bold text-lg">
                  <span>Total Payable:</span>
                  <span className="text-gov-blue">₹{plan === 'Monthly' ? '99' : '999'}</span>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-india-green text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-bold text-lg disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Subscribe Now'}
                </button>
                <p className="text-xs text-center text-gray-400 mt-4">
                  *This is a mock payment gateway for demonstration purposes. No real transaction will occur.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
