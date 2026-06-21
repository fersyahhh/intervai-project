import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import AuthLayout from './presentation/layouts/AuthLayout';
import DashboardLayout from './presentation/layouts/DashboardLayout';

// Route Guards
import ProtectedRoute from './presentation/components/modules/ProtectedRoute';

// Pages
import LandingPage from './presentation/pages/LandingPage';
import LoginPage from './presentation/pages/LoginPage';
import SignupPage from './presentation/pages/SignupPage';
import SetupPage from './presentation/pages/SetupPage';
import InterviewRoomPage from './presentation/pages/InterviewRoomPage';
import ReportDashboardPage from './presentation/pages/ReportDashboardPage';

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Public Routes without layout */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Protected/Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/setup" element={<SetupPage />} />
              <Route path="/interview" element={<InterviewRoomPage />} />
              <Route path="/report" element={<ReportDashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
