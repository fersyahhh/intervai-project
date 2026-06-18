import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

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
