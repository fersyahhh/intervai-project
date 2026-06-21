import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoImg from "../../assets/logo.png";

export default function DashboardLayout() {
  const { user } = useAuth();

  // Extract initials from user's full name
  const getInitials = () => {
    const name = user?.user_metadata?.full_name;
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-black">
      {/* Navbar Module could be extracted later */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between sticky top-0 z-50">
        <Link
          to="/"
          className="flex items-center gap-1 font-bold text-lg md:text-xl"
        >
          <img
            src={logoImg}
            alt="IntervAI Logo"
            className="w-10 h-10 md:w-13 md:h-13 object-contain shrink-0"
          />
          <span className="font-bold text-xl md:text-2xl tracking-tight">IntervAI</span>
        </Link>
        <nav className="flex items-center gap-2 md:gap-4">
          <p
            className="text-xs md:text-sm font-medium text-gray-500 hover:text-black"
          >
            Interviewee
          </p>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm md:text-base">
            {getInitials()}
          </div>
        </nav>
      </header>

      <main className="flex-grow p-4 sm:p-6 md:p-8 lg:p-12 blueprint-bg relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
