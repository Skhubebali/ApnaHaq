import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import SubscriptionPage from './pages/SubscriptionPage';
import SchemeDetails from './pages/SchemeDetails';
import ProfilePage from './pages/ProfilePage';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useStore(state => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

const SubscribedRoute = ({ children }) => {
  const { isAuthenticated, user } = useStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user && !user.isSubscribed) return <Navigate to="/subscribe" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route 
            path="subscribe" 
            element={
              <ProtectedRoute>
                <SubscriptionPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="dashboard" 
            element={
              <SubscribedRoute>
                <Dashboard />
              </SubscribedRoute>
            } 
          />
          <Route 
            path="scheme/:id" 
            element={
              <SubscribedRoute>
                <SchemeDetails />
              </SubscribedRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
