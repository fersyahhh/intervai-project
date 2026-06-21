import { useState, useEffect } from 'react';
import { Globe, AlertTriangle, X } from 'lucide-react';

export default function BrowserSupportModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the browser supports Web Speech API
    const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    
    // If not supported and they haven't dismissed the warning in this session
    if (!isSupported && !sessionStorage.getItem('browser-warning-dismissed')) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('browser-warning-dismissed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up border border-slate-100">
        <div className="absolute top-4 right-4">
          <button 
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 sm:p-10 text-center">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
            Browser Tidak Mendukung
          </h3>
          
          <p className="text-slate-500 mb-8 leading-relaxed">
            Maaf, browser yang Anda gunakan saat ini tidak mendukung fitur pengenalan suara (Web Speech API) yang dibutuhkan untuk simulasi wawancara.
          </p>

          <div className="bg-slate-50 rounded-xl p-5 mb-8 border border-slate-100 text-left">
            <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              Browser yang Direkomendasikan:
            </p>
            <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
              <li>Google Chrome (PC & Mobile)</li>
              <li>Microsoft Edge</li>
              <li>Safari (Versi 14.1 ke atas)</li>
            </ul>
          </div>

          <button 
            onClick={handleClose}
            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all active:scale-[0.98] shadow-md"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
