import { Link } from 'react-router-dom';
import { Search, CheckCircle, FileText, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gov-blue to-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Find Government Schemes You Are <span className="text-india-saffron">Eligible</span> For
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
            ApnaHaq intelligently matches your profile with hundreds of Central and State government schemes to ensure you get the benefits you deserve.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="bg-india-saffron hover:bg-orange-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/login" className="bg-white hover:bg-gray-100 text-gov-blue px-8 py-4 rounded-lg font-bold text-lg transition-colors">
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <h3 className="text-4xl font-bold text-gov-blue mb-2">500+</h3>
              <p className="text-gray-600 font-medium">Government Schemes</p>
            </div>
            <div className="p-6 border-t md:border-t-0 md:border-l md:border-r border-gray-200">
              <h3 className="text-4xl font-bold text-india-green mb-2">28</h3>
              <p className="text-gray-600 font-medium">States Covered</p>
            </div>
            <div className="p-6 border-t md:border-t-0 border-gray-200">
              <h3 className="text-4xl font-bold text-india-saffron mb-2">100%</h3>
              <p className="text-gray-600 font-medium">Free Eligibility Check</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gov-light-blue">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gov-blue mb-12">How ApnaHaq Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserIcon className="h-8 w-8 text-gov-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Create Profile</h3>
              <p className="text-gray-600">Enter your basic details like age, income, and occupation securely.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-india-saffron" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. AI Matching</h3>
              <p className="text-gray-600">Our engine instantly compares your profile against all active schemes.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-india-green" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Discover & Apply</h3>
              <p className="text-gray-600">View schemes you are 100% eligible for and get direct official apply links.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default LandingPage;
