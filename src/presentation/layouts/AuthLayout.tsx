import { Outlet, Link } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen blueprint-grid relative flex flex-col justify-center items-center p-6">
      {/* Background Orbs */}
      <div className="glow-orb glow-orb-blue w-[400px] h-[400px] top-10 left-10 animate-float-slow"></div>
      <div className="glow-orb glow-orb-purple w-[300px] h-[300px] bottom-10 right-10 animate-float"></div>

      {/* Nav Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-500 hover:text-black font-medium text-sm transition-colors bg-white/50 backdrop-blur-md px-3 py-2 rounded-lg border border-gray-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Home
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up mt-16 sm:mt-0">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoImg}
              alt="IntervAI Logo"
              className="w-10 h-10 md:w-13 md:h-13 object-contain shrink-0"
            />
            <span className="font-bold text-2xl tracking-tight">IntervAI</span>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-2xl shadow-xl p-8 sm:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
