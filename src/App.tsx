import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import AuthLayout from './presentation/layouts/AuthLayout';
import DashboardLayout from './presentation/layouts/DashboardLayout';

// Pages
import LandingPage from './presentation/pages/LandingPage';
import LoginPage from './presentation/pages/LoginPage';
import SignupPage from './presentation/pages/SignupPage';
import SetupPage from './presentation/pages/SetupPage';
import InterviewRoomPage from './presentation/pages/InterviewRoomPage';
import ReportDashboardPage from './presentation/pages/ReportDashboardPage';

function App() {
  return (
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
        <Route element={<DashboardLayout />}>
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/interview" element={<InterviewRoomPage />} />
          <Route path="/report" element={<ReportDashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
