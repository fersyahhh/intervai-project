import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error: authError } = await signIn(email, password);

    if (authError) {
      toast.error(authError.message || 'Invalid login credentials');
      setLoading(false);
    } else {
      navigate('/setup');
    }
  };


  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Selamat Datang Kembali</h2>
        <p className="text-gray-500 text-sm">Masuk untuk melanjutkan simulasi wawancara.</p>
      </div>
      


      <form onSubmit={handleSubmit} className="w-full space-y-5">
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
            placeholder="••••••••" 
          />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={loading} className="auth-btn-primary">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Masuk'}
          </button>
        </div>
      </form>
      

      <p className="mt-8 text-center text-sm text-gray-500">
        Belum punya akun?{' '}
        <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
