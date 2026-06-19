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

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          
          {/* Job Details Cell */}
          <div className="p-8 md:p-10 space-y-8 bg-white bento-cell hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Konteks Pekerjaan</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Posisi Pekerjaan</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all" 
                  placeholder="e.g. Frontend Developer" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Deskripsi Lengkap (Job Desc)</label>
                <textarea 
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all resize-none h-40 leading-relaxed" 
                  placeholder="Tempel persyaratan lengkap dari lowongan kerja di sini..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* CV Upload Cell */}
          <div className="p-8 md:p-10 space-y-8 bg-white bento-cell flex flex-col justify-between hover:bg-gray-50/50 transition-colors">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Resume (CV)</h2>
              </div>

              <label className="group relative flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-12 h-12 mb-4 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300 border border-gray-100 group-hover:border-blue-200">
                    <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <p className="mb-2 text-sm text-gray-700 font-semibold">
                    <span className="text-blue-600">Klik untuk unggah</span> atau seret PDF
                  </p>
                  <p className="text-xs text-gray-500 font-medium">Maksimal ukuran file 5MB</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept=".pdf" />
              </label>
            </div>
            
            <div className="pt-6">
              <Link 
                to="/interview" 
                className="group w-full flex items-center justify-center gap-2 py-3.5 bg-black text-white rounded-lg font-semibold text-sm hover:bg-gray-800 transition-all active:scale-[0.98]"
              >
                Mulai Simulasi
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
