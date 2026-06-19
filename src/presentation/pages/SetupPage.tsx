import { Link } from 'react-router-dom';
import { UploadCloud, FileText, Briefcase, Sparkles, ArrowRight } from 'lucide-react';

export default function SetupPage() {
  return (
    <div className="relative max-w-5xl mx-auto animate-fade-in-up">
      {/* Background Orbs */}
      <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl -z-10 pointer-events-none animate-float-slow" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">Persiapan Wawancara</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
          Lengkapi detail posisi yang Anda lamar. AI kami akan menganalisis profil Anda dan merancang pertanyaan wawancara yang spesifik.
        </p>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden shadow-xl shadow-blue-900/5 border border-white/60 bg-white/70 backdrop-blur-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          {/* Job Details Cell */}
          <div className="p-8 md:p-12 space-y-8 bg-white/40 relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm border border-blue-100/50">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Konteks Pekerjaan</h2>
                <p className="text-sm text-gray-500 font-medium mt-0.5">Beritahu AI apa yang Anda lamar</p>
              </div>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="space-y-2.5">
                <label className="block text-sm font-bold text-gray-700">Posisi / Peran</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm placeholder-gray-300 font-medium" 
                  placeholder="Contoh: Senior Frontend Developer" 
                />
              </div>
              <div className="space-y-2.5">
                <label className="block text-sm font-bold text-gray-700">Deskripsi Pekerjaan (Job Desc)</label>
                <textarea 
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm resize-none h-40 placeholder-gray-300 font-medium leading-relaxed" 
                  placeholder="Tempel persyaratan dari lowongan pekerjaan di sini. Semakin detail, semakin relevan pertanyaan AI-nya nanti..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* CV Upload Cell */}
          <div className="p-8 md:p-12 space-y-8 bg-gray-50/50 flex flex-col justify-between relative overflow-hidden">
            {/* Dot grid texture just for this side */}
            <div className="absolute inset-0 dot-grid opacity-50 mix-blend-multiply pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-sm border border-emerald-100/50">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Resume (CV)</h2>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">Unggah dokumen format PDF</p>
                </div>
              </div>

              <label className="group relative flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-2xl bg-white hover:bg-blue-50/50 hover:border-blue-400 transition-all cursor-pointer overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-blue-400/0 group-hover:bg-blue-400/5 transition-colors duration-500" />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                  <div className="w-16 h-16 mb-5 rounded-full bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm border border-gray-100 group-hover:border-blue-200">
                    <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <p className="mb-2 text-sm text-gray-700 font-bold">
                    <span className="text-blue-600">Klik untuk unggah</span> atau seret file
                  </p>
                  <p className="text-xs font-medium text-gray-400">PDF maksimal 5MB</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept=".pdf" />
              </label>
            </div>
            
            <div className="pt-8 relative z-10">
              <Link 
                to="/interview" 
                className="group w-full flex items-center justify-center gap-2.5 py-4 bg-blue-600 text-white rounded-xl font-bold text-base hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all active:scale-[0.98]"
              >
                <Sparkles className="w-5 h-5" />
                Mulai Simulasi Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
