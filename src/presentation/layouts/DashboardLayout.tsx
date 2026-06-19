import { Outlet, Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const { user } = useAuth();
  
  // Extract initials from user's full name
  const getInitials = () => {
    const name = user?.user_metadata?.full_name;
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-black">
      {/* Navbar Module could be extracted later */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <Briefcase className="w-6 h-6" />
          <span>IntervAI</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/setup" className="text-sm font-medium text-gray-500 hover:text-black">
            New Interview
          </Link>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {getInitials()}
          </div>
        </nav>
      </header>

      <main className="flex-grow p-6 md:p-8 lg:p-12 blueprint-bg relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
