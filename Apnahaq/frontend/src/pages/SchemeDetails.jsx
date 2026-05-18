import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../store/useStore';
import { ArrowLeft, ExternalLink, FileText, CheckCircle, Info, Calendar } from 'lucide-react';

const SchemeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useStore();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchemeDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/schemes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setScheme(res.data);
      } catch (err) {
        setError('Failed to load scheme details.');
      } finally {
        setLoading(false);
      }
    };
    fetchSchemeDetails();
  }, [id, token]);

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gov-blue"></div></div>;
  if (error || !scheme) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-600 hover:text-gov-blue mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Banner */}
        <div className="bg-gov-blue text-white p-8 relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldIcon className="h-48 w-48" />
          </div>
          <div className="relative z-10">
            <span className="bg-white text-gov-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {scheme.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-2">{scheme.name}</h1>
            <p className="text-blue-100 flex items-center">
              <span className="font-semibold">{scheme.department}</span>
              <span className="mx-2">•</span>
              <span>{scheme.level === 'CENTRAL' ? 'Government of India' : `${scheme.state} Government`}</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-800 flex items-center border-b pb-2 mb-4">
                <Info className="h-5 w-5 mr-2 text-gov-blue" /> Overview
              </h2>
              <p className="text-gray-700 leading-relaxed">{scheme.description}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 flex items-center border-b pb-2 mb-4">
                <CheckCircle className="h-5 w-5 mr-2 text-india-green" /> Key Benefits
              </h2>
              <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                <p className="text-gray-800 font-medium">{scheme.benefits}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 flex items-center border-b pb-2 mb-4">
                <FileText className="h-5 w-5 mr-2 text-india-saffron" /> Eligibility Criteria
              </h2>
              <p className="text-gray-700 leading-relaxed">{scheme.eligibilityText}</p>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-4">How to Apply</h3>
              <p className="text-sm text-gray-600 mb-4">{scheme.applicationProcess}</p>
              
              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Required Documents:</h4>
                <ul className="text-sm text-gray-700 list-disc pl-4 space-y-1">
                  {scheme.requiredDocuments.split(',').map((doc, i) => (
                    <li key={i}>{doc.trim()}</li>
                  ))}
                </ul>
              </div>

              {scheme.deadline && (
                <div className="flex items-center text-sm text-red-600 font-medium mb-6">
                  <Calendar className="h-4 w-4 mr-2" />
                  Deadline: {new Date(scheme.deadline).toLocaleDateString()}
                </div>
              )}

              <a 
                href={scheme.officialLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center bg-india-green hover:bg-green-700 text-white py-3 px-4 rounded-md font-bold transition-colors shadow-sm"
              >
                Apply on Official Portal <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShieldIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default SchemeDetails;
