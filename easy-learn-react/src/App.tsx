import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import LessonViewer from './pages/LessonViewer';
import Playground from './pages/Playground';
import Profile from './pages/Profile';
import Career from './pages/Career';
import Certificates from './pages/Certificates';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PracticeLabs from './pages/PracticeLabs';
import MockTest from './pages/MockTest';
import AuthCallback from './pages/AuthCallback';
import AdminPanel from './pages/AdminPanel';
import LandingPage from './pages/LandingPage';

// Smart root redirect: authenticated → dashboard, remember_me → /login, first-time → /landing
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#11131d', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:40, height:40, border:'4px solid rgba(200,160,74,.3)', borderTopColor:'#c8a04a', borderRadius:'50%', animation:'spin .7s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (user) return <Navigate to="/dashboard" replace />;
  const remembered = localStorage.getItem('el_remember_me') === '1';
  return <Navigate to={remembered ? '/login' : '/landing'} replace />;
};

// Protect all app routes — redirect to /login if not authenticated
const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#11131d', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:40, height:40, border:'4px solid rgba(200,160,74,.3)', borderTopColor:'#c8a04a', borderRadius:'50%', animation:'spin .7s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return (
    <ErrorBoundary>
      <CourseProvider>
        <Layout />
      </CourseProvider>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Entry point */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/landing" element={<LandingPage />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected app routes */}
          <Route path="/dashboard" element={<ProtectedLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="learning" element={<LessonViewer />} />
            <Route path="playground" element={<Playground />} />
            <Route path="labs" element={<PracticeLabs />} />
            <Route path="mocktest" element={<MockTest />} />
            <Route path="profile" element={<Profile />} />
            <Route path="career" element={<Career />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Coming Soon</h2>
                <p className="text-slate-500 max-w-md">This module is under development.</p>
              </div>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
