import { Link } from 'react-router-dom';
import { UploadCloud, FileText, Briefcase, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function SetupPage() {
  const [dragActive, setDragActive] = useState(false);

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 animate-fade-in-up relative">
      
      {/* Background blueprint texture matching landing page */}
      <div className="absolute inset-0 blueprint-grid opacity-60 -z-10 pointer-events-none"></div>
      
      {/* Very subtle top gradient wash */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10"></div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Kustomisasi Sesi
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Atur konteks wawancara dengan posisi pekerjaan dan riwayat hidup Anda untuk mendapatkan pertanyaan yang presisi.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            
            {/* Left Column: Job Details */}
            <div className="p-8 md:p-10 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Konteks Peran</h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Posisi Pekerjaan
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                    placeholder="Contoh: Senior Frontend Engineer" 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-semibold text-slate-700">
                      Deskripsi Pekerjaan
                    </label>
                    <span className="text-xs text-slate-400 font-medium">Opsional</span>
                  </div>
                  <textarea 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm resize-none h-40 leading-relaxed"
                    placeholder="Salin dan tempel deskripsi dari lowongan kerja untuk akurasi terbaik..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Right Column: CV Upload */}
            <div className="p-8 md:p-10 space-y-8 bg-slate-50/50 flex flex-col justify-between">
              
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/5 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-900" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Dokumen Resume</h2>
                </div>

                <label 
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
                  className={`relative flex flex-col items-center justify-center w-full h-56 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                    dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center transition-colors ${
                      dragActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="mb-1 text-sm font-semibold text-slate-900">
                      Klik atau seret file PDF ke sini
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Maksimal ukuran file 5MB
                    </p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" accept=".pdf" />
                </label>
              </div>

              <div className="pt-8">
                <Link 
                  to="/interview" 
                  className="group flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 active:scale-[0.98]"
                >
                  Mulai Simulasi
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
