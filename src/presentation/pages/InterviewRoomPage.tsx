import { Link } from 'react-router-dom';
import { Mic, Square, Loader2, AlertCircle } from 'lucide-react';
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
  
  const currentQuestion = questions.length > 0 
    ? questions[currentQuestionIndex] 
    : "Ceritakan tentang proyek paling menantang yang pernah Anda kerjakan dan bagaimana Anda menyelesaikannya.";
  
  const displayPosition = position || "Posisi Pekerjaan";
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = questions.length > 0 ? questions.length : 5;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 text-gray-900">Ruang Wawancara</h1>
          <p className="text-gray-500 font-medium">{displayPosition}</p>
        </div>
        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 w-max">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Pertanyaan {questionNumber} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Warnings */}
      {!isSupported && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">Browser Anda tidak mendukung Web Speech API. Silakan gunakan Google Chrome untuk fitur ini.</p>
        </div>
      )}

      {error && isSupported && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Main Bento Grid Container */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col">
        
        {/* AI Question Section */}
        <div className="p-8 md:p-10 border-b border-gray-200 bg-blue-50/30 dot-grid relative">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
              AI Interviewer
            </span>
            <p className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed">
              "{currentQuestion}"
            </p>
          </div>
        </div>

        {/* User Answer / STT Section */}
        <div className="p-8 md:p-10 min-h-[350px] flex flex-col justify-between bg-white relative">
          
          <div className="flex-grow">
            {isRecording || transcript ? (
              <p className="text-gray-700 leading-relaxed text-lg font-medium">
                {transcript}
                {isRecording && (
                  <span className="w-1.5 h-5 bg-blue-500 inline-block ml-1.5 animate-pulse align-middle" />
                )}
              </p>
            ) : isProcessing ? (
              <div className="flex flex-col items-center justify-center h-full text-blue-600 space-y-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="animate-pulse font-semibold text-sm">Menyimpan dan Menganalisis...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-3 text-gray-400">
                <Mic className="w-8 h-8 opacity-50" />
                <p className="font-medium text-sm">Klik mikrofon di bawah untuk mulai berbicara.</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
            <div className="w-32 text-sm text-gray-500">
              {isRecording && (
                <span className="inline-flex items-center gap-2 font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
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
                 <div className="absolute inset-0 bg-red-100 rounded-full animate-ping scale-150"></div>
              )}
              <button 
                onClick={toggleRecording}
                disabled={isProcessing || !isSupported}
                className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full transition-transform active:scale-95 shadow-sm ${
                  isRecording 
                    ? 'bg-white text-red-600 border-2 border-red-200 hover:bg-red-50' 
                    : 'bg-black text-white hover:bg-gray-800 hover:-translate-y-1'
                } ${(isProcessing || !isSupported) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
              >
                {isRecording ? <Square className="w-6 h-6" fill="currentColor" /> : <Mic className="w-6 h-6" />}
              </button>
            </div>

            <div className="w-32 text-right">
              <Link 
                to="/report" 
                className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
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
