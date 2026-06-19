import { Link } from 'react-router-dom';
import { UploadCloud, FileText, Briefcase, ArrowRight } from 'lucide-react';

export default function SetupPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 animate-fade-in-up relative">
      {/* Background blueprint subtle texture matching landing page */}
      <div className="absolute inset-0 blueprint-grid opacity-30 -z-10 pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
          Persiapan Wawancara
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
          Lengkapi detail posisi yang dilamar dan unggah CV Anda. AI kami akan merancang pertanyaan yang 100% relevan.
        </p>
      </div>

      <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-gray-100">
          
          {/* Job Details Cell */}
          <div className="p-8 md:p-10 space-y-8 bg-white transition-colors relative overflow-hidden group">
            
            <div className="flex items-center gap-4 mb-2 relative z-10">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-blue-200 rounded-full translate-x-1 translate-y-1 group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-transform"></div>
                <div className="absolute inset-0 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Konteks Pekerjaan</h2>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Posisi Pekerjaan</label>
                <input 
                  type="text" 
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium" 
                  placeholder="e.g. Frontend Developer" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Deskripsi Lengkap (Job Desc)</label>
                <textarea 
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none h-40 leading-relaxed font-medium" 
                  placeholder="Tempel persyaratan lengkap dari lowongan kerja di sini..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* CV Upload Cell */}
          <div className="p-8 md:p-10 space-y-8 bg-white flex flex-col justify-between transition-colors group relative overflow-hidden">
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-emerald-200 rounded-full translate-x-1 translate-y-1 group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-transform"></div>
                  <div className="absolute inset-0 bg-white border-2 border-emerald-600 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Resume (CV)</h2>
              </div>

              <label className="group/dropzone relative flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-2xl bg-white hover:border-emerald-500 transition-all cursor-pointer overflow-hidden">
                <div className="absolute inset-0 diagonal-stripes opacity-0 group-hover/dropzone:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                  <div className="w-14 h-14 mb-4 rounded-full bg-emerald-50 text-emerald-600 shadow-sm flex items-center justify-center group-hover/dropzone:-translate-y-2 transition-transform duration-300 border border-emerald-100">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <p className="mb-2 text-sm text-gray-900 font-bold">
                    Klik untuk unggah atau seret file PDF
                  </p>
                  <p className="text-xs text-gray-500 font-medium">Maksimal ukuran file 5MB</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept=".pdf" />
              </label>
            </div>
            
            <div className="pt-6 relative z-10">
              <Link 
                to="/interview" 
                className="group/btn w-full flex items-center justify-center gap-2 py-4 bg-black text-white rounded-xl font-bold text-base hover:bg-gray-800 transition-all active:scale-[0.98] shadow-sm"
              >
                Mulai Simulasi
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
