import { Link, useNavigate } from 'react-router-dom';
import { Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Home, RotateCcw } from 'lucide-react';
import { useInterviewStore } from '../../store/useInterviewStore';
import { useEffect } from 'react';

export default function ReportDashboardPage() {
  const navigate = useNavigate();
  const {
    position,
    overallScore,
    detailedFeedbacks,
    resetStore
  } = useInterviewStore();

  // Redirect if no interview data
  useEffect(() => {
    if (detailedFeedbacks.length === 0) {
      navigate('/setup');
    }
  }, [detailedFeedbacks, navigate]);

  if (detailedFeedbacks.length === 0) {
    return null;
  }

  const displayPosition = position || "Posisi Pekerjaan";
  const score = overallScore || 0;

  // Score interpretation
  const getScoreInterpretation = (score: number) => {
    if (score >= 85) return { label: 'Sangat Baik', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' };
    if (score >= 70) return { label: 'Baik', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    if (score >= 60) return { label: 'Cukup', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' };
    return { label: 'Perlu Peningkatan', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  const scoreInfo = getScoreInterpretation(score);

  // Aggregate all strengths and improvements
  const allStrengths = detailedFeedbacks.flatMap(item => item.feedback?.strengths || []);
  const allImprovements = detailedFeedbacks.flatMap(item => item.feedback?.improvements || []);
  const allCorrections = detailedFeedbacks.flatMap(item => item.feedback?.corrections || []);

  const handleStartNew = () => {
    resetStore();
    navigate('/setup');
  };

  return (
    <div className="bg-transparent pb-12 animate-fade-in-up relative">
      
      {/* Very subtle top gradient wash */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10 rounded-3xl opacity-50"></div>

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">Laporan Hasil Interview</h1>
            <p className="text-slate-500 font-medium">{displayPosition}</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-xl font-medium text-sm hover:bg-slate-50 transition-all text-slate-700 shadow-sm">
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <Link 
              to="/"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-800 transition-all shadow-sm"
            >
              <Home className="w-4 h-4" /> Beranda
            </Link>
          </div>
        </header>

        {/* Score Summary Card */}
        <div className={`bg-white rounded-3xl border ${scoreInfo.borderColor} shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden`}>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            {/* Overall Score Display */}
            <div className={`p-10 ${scoreInfo.bgColor} flex flex-col items-center justify-center text-center`}>
              <div className={`relative w-36 h-36 flex items-center justify-center rounded-full border-8 ${scoreInfo.borderColor} mb-6 bg-white shadow-sm`}>
                <span className={`text-5xl font-bold ${scoreInfo.color}`}>{Math.round(score)}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Skor Keseluruhan</h2>
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${scoreInfo.bgColor} ${scoreInfo.color} border ${scoreInfo.borderColor}`}>
                {scoreInfo.label}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="p-8 md:col-span-2 space-y-6 bg-white">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Ringkasan Performa</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{detailedFeedbacks.length}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600">Pertanyaan Dijawab</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{allStrengths.length}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600">Kekuatan Teridentifikasi</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{allImprovements.length}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600">Area Pengembangan</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{allCorrections.length}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600">Koreksi Verbal</p>
                </div>
              </div>

              <button 
                onClick={handleStartNew}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm mt-4"
              >
                <RotateCcw className="w-4 h-4" />
                Mulai Sesi Latihan Baru
              </button>
            </div>

          </div>
        </div>

        {/* Detailed Question-by-Question Feedback */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Feedback Detail per Pertanyaan</h2>
          
          {detailedFeedbacks.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
              
              {/* Question Header */}
              <div className="bg-gradient-to-r from-blue-50 to-transparent p-6 border-b border-slate-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest">
                        Pertanyaan {index + 1}
                      </span>
                      <span className="text-2xl font-bold text-blue-600">{item.feedback?.score || 0}</span>
                    </div>
                    <p className="text-slate-900 font-semibold text-lg leading-relaxed">"{item.question}"</p>
                  </div>
                </div>
              </div>

              {/* Answer & Feedback */}
              <div className="p-6 space-y-6">
                
                {/* User Answer */}
                <div>
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Jawaban Anda:</h4>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
                    {item.answer}
                  </p>
                </div>

                {/* AI Feedback */}
                {item.feedback?.feedback && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Feedback AI:</h4>
                    <p className="text-slate-600 leading-relaxed">
                      {item.feedback.feedback}
                    </p>
                  </div>
                )}

                {/* Strengths */}
                {item.feedback?.strengths && item.feedback.strengths.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Kekuatan
                    </h4>
                    <ul className="space-y-2">
                      {item.feedback.strengths.map((strength, i) => (
                        <li key={i} className="flex gap-3 text-slate-700">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {item.feedback?.improvements && item.feedback.improvements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-amber-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Area Pengembangan
                    </h4>
                    <ul className="space-y-2">
                      {item.feedback.improvements.map((improvement, i) => (
                        <li key={i} className="flex gap-3 text-slate-700">
                          <span className="text-amber-500 font-bold">→</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Corrections (Filler Words, Pauses) */}
                {item.feedback?.corrections && item.feedback.corrections.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-red-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Koreksi Verbal (Filler Words / Jeda)
                    </h4>
                    <ul className="space-y-2">
                      {item.feedback.corrections.map((correction, i) => (
                        <li key={i} className="flex gap-3 text-slate-700">
                          <span className="text-red-500 font-bold">!</span>
                          <span>{correction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
