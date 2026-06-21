import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error: authError } = await signUp(email, password, fullName);

    if (authError) {
      toast.error(authError.message || 'Gagal membuat akun. Silakan coba lagi.');
      setLoading(false);
    } else {
      // Because email confirmations are turned off, user is logged in automatically
      navigate('/setup');
    }
  };


  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Buat Akun Baru</h2>
        <p className="text-gray-500 text-sm">Mulai perjalanan karirmu bersama IntervAI hari ini.</p>
      </div>
      


      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">Nama Lengkap</label>
          <input 
            type="text" 
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="auth-input" 
            placeholder="John Doe" 
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">Email Address</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input" 
            placeholder="nama@email.com" 
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">Password</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input" 
            placeholder="Minimal 6 karakter" 
          />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={loading} className="auth-btn-primary">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Daftar Sekarang'}
          </button>
        </div>
      </form>
      

      <p className="mt-8 text-center text-sm text-gray-500">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
