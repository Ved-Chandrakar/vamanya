import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import TherapyCalendar from './components/therapy/TherapyCalendar';
import PractitionerDashboard from './components/therapy/PractitionerDashboard';
import ProgressTracker from './components/feedback/ProgressTracker';
import FeedbackView from './components/feedback/FeedbackView';
import NotificationBell from './components/notifications/NotificationBell';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading...
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Main App Routes Component
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/schedule" 
        element={
          <ProtectedRoute>
            <TherapyCalendar />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/practitioner" 
        element={
          <ProtectedRoute>
            <PractitionerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/progress" 
        element={
          <ProtectedRoute>
            <ProgressTracker />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/feedback" 
        element={
          <ProtectedRoute>
            <FeedbackView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute>
            <NotificationBell />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          lineHeight: 1.5,
          color: '#111827',
          backgroundColor: '#f9fafb',
          minHeight: '100vh'
        }}>
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
