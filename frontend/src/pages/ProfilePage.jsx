import { useState, useEffect } from 'react';
import axios from 'axios';
import { useStore } from '../store/useStore';
import { User, Save } from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser, token } = useStore();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        age: user.age || '',
        gender: user.gender || 'Male',
        annualIncome: user.annualIncome || '',
        occupation: user.occupation || '',
        educationLevel: user.educationLevel || '',
        educationMarks: user.educationMarks || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.put(`${API_URL}/api/user/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white p-8 rounded-xl shadow border-t-4 border-gov-blue">
        <div className="flex items-center space-x-3 mb-6 border-b pb-4">
          <User className="h-8 w-8 text-gov-blue" />
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        </div>
        
        {message.text && (
          <div className={`p-3 rounded mb-6 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="fullName" value={formData.fullName || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-gray-50" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input type="number" name="age" value={formData.age || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-gray-50" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select name="gender" value={formData.gender || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-gray-50">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income (₹)</label>
            <input type="number" name="annualIncome" value={formData.annualIncome || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-gray-50" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
            <select name="occupation" required onChange={handleChange} value={formData.occupation || ''} className="w-full px-3 py-2 border rounded-md bg-gray-50">
                <option value="Student">Student</option>
                <option value="Farmer">Farmer</option>
                <option value="Business">Business</option>
                <option value="Salaried">Salaried Employee</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Daily Wage">Daily Wage</option>
                <option value="Unemployed">Unemployed</option>
              </select>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Qualification</label>
              <input type="text" name="educationLevel" value={formData.educationLevel || ''} onChange={handleChange} placeholder="e.g. B.Tech, 12th Pass" className="w-full px-3 py-2 border rounded-md bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Marks (%)</label>
              <input type="number" step="0.1" name="educationMarks" value={formData.educationMarks || ''} onChange={handleChange} placeholder="e.g. 85.5" className="w-full px-3 py-2 border rounded-md bg-gray-50" />
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center bg-gov-blue text-white px-6 py-2 rounded hover:bg-blue-800 transition disabled:opacity-50 font-medium"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
