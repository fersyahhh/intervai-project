import { useNavigate, Link } from 'react-router-dom';
import { UploadCloud, FileText, Briefcase, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useInterviewStore } from '../../store/useInterviewStore';
import { extractTextFromPDF } from '../../utils/pdfParser';
import toast from 'react-hot-toast';

export default function SetupPage() {
  const navigate = useNavigate();
  const setInterviewContext = useInterviewStore(state => state.setInterviewContext);
  const setQuestions = useInterviewStore(state => state.setQuestions);
  
  const [dragActive, setDragActive] = useState(false);
  const [position, setPosition] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleStartSimulation = async () => {
    if (!position.trim()) {
      toast.error('Posisi pekerjaan wajib diisi.');
      return;
    }
    if (!file) {
      toast.error('Mohon unggah CV Anda (PDF).');
      return;
    }

    setIsGenerating(true);

    try {
      // 1. Extract text from PDF
      const cvText = await extractTextFromPDF(file);

      // 2. Upload to Supabase Storage
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        throw new Error('Sesi tidak valid. Anda harus login terlebih dahulu.');
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${authData.user.id}/${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('cv-uploads')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Gagal mengunggah CV: ${uploadError.message}`);
      }

      // 3. Call Edge Function to generate questions
      const { data, error: functionError } = await supabase.functions.invoke('generate-interview', {
        body: {
          position,
          jobDescription,
          cvText
        }
      });

      if (functionError) {
        throw new Error(`Edge Function Error: ${functionError.message}`);
      }

      if (!data || !data.questions) {
        throw new Error('Respons LLM Groq tidak valid.');
      }

      // DEBUG: Check how many questions were generated
      console.log('🔍 Questions received from Edge Function:', data.questions);
      console.log('🔢 Total questions:', data.questions.length);

      // 4. Update Store and Navigate
      setInterviewContext(crypto.randomUUID(), position, jobDescription, fileName);
      setQuestions(data.questions);
      navigate('/interview');

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-transparent pb-12 animate-fade-in-up relative">
      
      {/* Very subtle top gradient wash */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10 rounded-3xl opacity-50"></div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Back to Home Button */}
        <div className="flex justify-start items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
          >
            <span className='mb-1'>←</span>   
            Back To Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-3 md:space-y-4 px-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            Kustomisasi Sesi
          </h1>
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Atur konteks wawancara dengan posisi pekerjaan dan riwayat hidup Anda untuk mendapatkan pertanyaan yang presisi.
          </p>
        </div>



        {/* Main Content Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            
            {/* Left Column: Job Details */}
            <div className="p-5 md:p-8 lg:p-10 space-y-6 md:space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Job Details</h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Posisi Pekerjaan
                  </label>
                  <input 
                    type="text" 
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    disabled={isGenerating}
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
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    disabled={isGenerating}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm resize-none h-40 leading-relaxed"
                    placeholder="Salin dan tempel deskripsi dari lowongan kerja untuk akurasi terbaik..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Right Column: CV Upload */}
            <div className="p-5 md:p-8 lg:p-10 space-y-6 md:space-y-8 bg-slate-50/50 flex flex-col justify-between">
              
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/5 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-900" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Document Resume</h2>
                </div>

                <label 
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => { 
                    e.preventDefault(); 
                    setDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      setFile(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`relative flex flex-col items-center justify-center w-full h-56 rounded-2xl border-2 border-dashed transition-all ${!isGenerating ? 'cursor-pointer' : 'cursor-not-allowed'} ${
                    dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center transition-colors ${
                      dragActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {file ? <FileText className="w-6 h-6 text-blue-600" /> : <UploadCloud className="w-6 h-6" />}
                    </div>
                    <p className="mb-1 text-sm font-semibold text-slate-900">
                      {file ? file.name : 'Klik atau seret file PDF ke sini'}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Maksimal ukuran file 5MB'}
                    </p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} disabled={isGenerating} />
                </label>
              </div>

              <div className="pt-8">
                <button 
                  onClick={handleStartSimulation}
                  disabled={isGenerating}
                  className="group flex items-center justify-center w-full py-4 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed px-4"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                      <span className="text-center leading-tight">Menganalisis CV & Membuat Pertanyaan...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Mulai Simulasi</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
