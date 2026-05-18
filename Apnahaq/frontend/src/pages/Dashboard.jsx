import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../store/useStore';
import { CheckCircle, AlertTriangle, XCircle, Search, Filter } from 'lucide-react';

const Dashboard = () => {
  const { user, token } = useStore();
  const [eligibilityData, setEligibilityData] = useState({ eligible: [], partial: [], notEligible: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/schemes/eligible', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEligibilityData(res.data);
      } catch (err) {
        if (err.response?.status === 403) {
          navigate('/subscribe');
        } else {
          setError('Failed to fetch eligibility data. Make sure backend is running.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gov-blue"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-gov-blue mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.fullName}</h1>
          <p className="text-gray-600">Based on your profile, here are your personalized scheme recommendations.</p>
        </div>
        <div className="hidden md:flex space-x-4 text-sm">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="block text-gray-500">State</span>
            <span className="font-semibold text-gov-blue">{user.state}</span>
          </div>
          <div className="bg-orange-50 px-4 py-2 rounded-lg">
            <span className="block text-gray-500">Income</span>
            <span className="font-semibold text-india-saffron">₹{user.annualIncome.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl flex items-center shadow-sm">
          <CheckCircle className="h-10 w-10 text-india-green mr-4" />
          <div>
            <h3 className="text-3xl font-bold text-green-800">{eligibilityData.eligible.length}</h3>
            <p className="text-green-700 font-medium">100% Eligible Schemes</p>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl flex items-center shadow-sm">
          <AlertTriangle className="h-10 w-10 text-yellow-500 mr-4" />
          <div>
            <h3 className="text-3xl font-bold text-yellow-800">{eligibilityData.partial.length}</h3>
            <p className="text-yellow-700 font-medium">Partially Eligible</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl flex items-center shadow-sm">
          <XCircle className="h-10 w-10 text-red-500 mr-4" />
          <div>
            <h3 className="text-3xl font-bold text-red-800">{eligibilityData.notEligible.length}</h3>
            <p className="text-red-700 font-medium">Not Eligible</p>
          </div>
        </div>
      </div>

      {/* Scheme Lists */}
      <div className="space-y-12">
        {/* Eligible */}
        <section>
          <div className="flex items-center justify-between mb-6 border-b pb-2">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="bg-india-green w-3 h-8 mr-3 rounded-sm inline-block"></span>
              Eligible Schemes
            </h2>
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">High Priority</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibilityData.eligible.length > 0 ? (
              eligibilityData.eligible.map(scheme => (
                <SchemeCard key={scheme.id} scheme={scheme} status="eligible" navigate={navigate} />
              ))
            ) : (
              <p className="text-gray-500 col-span-full">No schemes found matching all your criteria.</p>
            )}
          </div>
        </section>

        {/* Partial */}
        <section>
          <div className="flex items-center justify-between mb-6 border-b pb-2">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="bg-yellow-400 w-3 h-8 mr-3 rounded-sm inline-block"></span>
              Partially Eligible Schemes
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibilityData.partial.length > 0 ? (
              eligibilityData.partial.map(scheme => (
                <SchemeCard key={scheme.id} scheme={scheme} status="partial" navigate={navigate} />
              ))
            ) : (
              <p className="text-gray-500 col-span-full">No partially eligible schemes found.</p>
            )}
          </div>
        </section>

        {/* Not Eligible */}
        <section className="opacity-70">
          <div className="flex items-center justify-between mb-6 border-b pb-2">
            <h2 className="text-xl font-bold text-gray-600 flex items-center">
              <span className="bg-red-400 w-3 h-8 mr-3 rounded-sm inline-block"></span>
              Not Eligible
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibilityData.notEligible.slice(0, 3).map(scheme => (
              <SchemeCard key={scheme.id} scheme={scheme} status="not_eligible" navigate={navigate} />
            ))}
            {eligibilityData.notEligible.length > 3 && (
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <button className="text-gov-blue font-medium hover:underline">View {eligibilityData.notEligible.length - 3} more</button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const SchemeCard = ({ scheme, status, navigate }) => {
  const getStatusStyles = () => {
    switch(status) {
      case 'eligible': return 'border-t-4 border-india-green';
      case 'partial': return 'border-t-4 border-yellow-400';
      case 'not_eligible': return 'border-t-4 border-red-400 bg-gray-50';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full ${getStatusStyles()}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {scheme.category}
        </span>
        <span className="text-xs font-semibold text-gov-blue">
          {scheme.level === 'CENTRAL' ? 'Central Gov.' : `${scheme.state} State`}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{scheme.name}</h3>
      <p className="text-sm text-gray-600 flex-grow line-clamp-3 mb-4">{scheme.description}</p>
      
      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Match</span>
          <span className={`font-bold ${status === 'eligible' ? 'text-india-green' : status === 'partial' ? 'text-yellow-600' : 'text-red-500'}`}>
            {scheme.matchPercentage}%
          </span>
        </div>
        <button 
          onClick={() => navigate(`/scheme/${scheme.id}`)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            status === 'not_eligible' 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-gov-blue text-white hover:bg-blue-800'
          }`}
          disabled={status === 'not_eligible'}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
