import { Link } from 'react-router-dom';
import { Mic, Square, Loader2, AlertCircle, Volume2 } from 'lucide-react';
import { useInterviewStore } from '../../store/useInterviewStore';
import { useSpeechToText } from '../../hooks/useSpeechToText';

export default function InterviewRoomPage() {
  const {
    position,
    questions,
    currentQuestionIndex,
    transcript,
    status
  } = useInterviewStore();

  const {
    isSupported,
    isRecording,
    error,
    toggleRecording
  } = useSpeechToText();

  const isProcessing = status === 'processing';
  
  // Use a fallback question if no questions are loaded yet
  const currentQuestion = questions.length > 0 
    ? questions[currentQuestionIndex] 
    : "Ceritakan tentang diri Anda dan pengalaman kerja Anda sebelumnya.";
  
  const displayPosition = position || "Posisi Pekerjaan";
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = questions.length > 0 ? questions.length : 5;

  return (
    <div className="relative space-y-8 max-w-5xl mx-auto animate-fade-in-up">
      {/* Ambient Glow */}
      <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none animate-float" />
      <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[100px] -z-10 pointer-events-none animate-float-reverse delay-300" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Sesi Wawancara</h1>
          <p className="text-gray-500 font-medium mt-1">{displayPosition}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full font-bold border border-blue-100 shadow-sm">
            Pertanyaan {questionNumber} / {totalQuestions}
          </div>
        </div>
      </div>

      {/* Warnings */}
      {!isSupported && (
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">Browser Anda tidak mendukung Web Speech API. Silakan gunakan Google Chrome untuk fitur ini.</p>
        </div>
      )}

      {error && isSupported && (
        <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200 text-amber-700 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Main Glass Card */}
      <div className="glass-card rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/5 border border-white/60 bg-white/60 backdrop-blur-2xl transition-all duration-300">
        
        {/* AI Question Section */}
        <div className="p-8 md:p-12 border-b border-gray-100 bg-gradient-to-b from-white/80 to-white/40 relative overflow-hidden">
          {/* Subtle blueprint pattern */}
          <div className="absolute inset-0 blueprint-grid opacity-30 mix-blend-multiply pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">AI Interviewer</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight tracking-tight">
              "{currentQuestion}"
            </p>
          </div>
        </div>

        {/* User Answer / STT Section */}
        <div className="p-8 md:p-12 min-h-[350px] flex flex-col justify-between relative">
          <div className="flex-grow">
            {isRecording || transcript ? (
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed text-xl font-medium">
                  {transcript}
                  {isRecording && (
                    <span className="w-2 h-6 bg-blue-500 inline-block ml-2 animate-pulse align-middle rounded-full" />
                  )}
                </p>
              </div>
            ) : isProcessing ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-blue-600">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner border border-blue-100">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <span className="animate-pulse font-bold tracking-wide">Menyimpan & Memproses Jawaban...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 opacity-60">
                <Mic className="w-12 h-12" />
                <p className="font-medium text-lg">Klik ikon mikrofon di bawah untuk mulai menjawab.</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100/60">
            <div className="text-sm font-bold text-gray-500 w-32">
              {isRecording && (
                <span className="flex items-center gap-2.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-full w-max border border-red-100">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  Merekam
                </span>
              )}
            </div>
            
            {/* Record Button */}
            <div className="relative">
              {isRecording && (
                <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20 scale-150"></div>
              )}
              <button 
                onClick={toggleRecording}
                disabled={isProcessing || !isSupported}
                className={`relative z-10 flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ${
                  isRecording 
                    ? 'bg-red-50 text-red-500 hover:bg-red-100 shadow-inner scale-95 border-2 border-red-200' 
                    : 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 border border-blue-400'
                } ${(isProcessing || !isSupported) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
              >
                {isRecording ? <Square className="w-7 h-7" fill="currentColor" /> : <Mic className="w-8 h-8" />}
              </button>
            </div>

            <div className="w-32 text-right">
              <Link 
                to="/report" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all active:scale-95"
              >
                Selesai
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
