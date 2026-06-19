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
    <div className="relative max-w-4xl mx-auto py-8 animate-fade-in-up">
      {/* Background blueprint subtle texture matching landing page */}
      <div className="absolute inset-0 blueprint-grid opacity-50 -z-10 pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1 text-black">Ruang Wawancara</h1>
            <p className="text-gray-500 font-medium">{displayPosition}</p>
          </div>
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-2 w-max">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block animate-pulse" />
            <span className="text-xs font-bold text-black uppercase tracking-wider">
              Pertanyaan {questionNumber} / {totalQuestions}
            </span>
          </div>
        </div>

        {/* Warnings */}
        {!isSupported && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm font-medium">Browser Anda tidak mendukung Web Speech API. Silakan gunakan Google Chrome untuk fitur ini.</p>
          </div>
        )}

        {error && isSupported && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Main Bento Grid Container */}
        <div className="border-2 border-gray-100 rounded-[2rem] overflow-hidden bg-white shadow-sm flex flex-col relative z-10">
          
          {/* Question Section */}
          <div className="p-8 md:p-12 border-b-2 border-gray-100 bg-white relative">
            <div className="relative z-10 pt-2">
              <div className="flex items-center gap-2 mb-6">
                 <div className="relative">
                   <div className="absolute inset-0 bg-blue-100 rounded-lg translate-x-1 translate-y-1"></div>
                   <div className="relative bg-white border-2 border-blue-600 text-blue-600 font-bold px-3 py-1.5 rounded-lg text-xs uppercase tracking-widest flex items-center gap-2">
                     AI Interviewer
                   </div>
                 </div>
              </div>
              <p className="text-2xl md:text-3xl font-medium text-black leading-[40px] tracking-tight">
                "{currentQuestion}"
              </p>
            </div>
          </div>

          {/* User Answer / STT Section */}
          <div className="p-8 md:p-12 min-h-[350px] flex flex-col justify-between bg-white relative">
            
            <div className="flex-grow">
              {isRecording || transcript ? (
                <p className="text-black leading-[36px] text-xl font-medium">
                  {transcript}
                  {isRecording && (
                    <span className="w-2 h-6 bg-blue-600 inline-block ml-2 animate-pulse align-middle rounded-sm" />
                  )}
                </p>
              ) : isProcessing ? (
                <div className="flex flex-col items-center justify-center h-full text-blue-600 space-y-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border-2 border-blue-100">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                  <span className="animate-pulse font-bold text-sm tracking-wide text-black">Menyimpan dan Menganalisis...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-400">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                    <Mic className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="font-medium text-base text-gray-500">Klik mikrofon di bawah untuk mulai berbicara.</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t-2 border-gray-100">
              <div className="w-32 text-sm text-gray-500">
                {isRecording && (
                  <span className="inline-flex items-center gap-2 font-bold text-blue-600 bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-100">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                    </span>
                    Merekam
                  </span>
                )}
              </div>
              
              {/* Record Button */}
              <div className="relative">
                {isRecording && (
                   <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping scale-150 duration-1000"></div>
                )}
                <button 
                  onClick={toggleRecording}
                  disabled={isProcessing || !isSupported}
                  className={`relative z-10 flex items-center justify-center w-20 h-20 rounded-full transition-transform active:scale-95 shadow-sm ${
                    isRecording 
                      ? 'bg-white text-blue-600 border-4 border-blue-100 hover:bg-blue-50' 
                      : 'bg-black text-white hover:bg-gray-800 hover:-translate-y-1'
                  } ${(isProcessing || !isSupported) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                >
                  {isRecording ? <Square className="w-8 h-8" fill="currentColor" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>

              <div className="w-32 text-right">
                <Link 
                  to="/report" 
                  className="inline-flex text-sm font-bold text-black hover:text-white transition-colors bg-gray-100 hover:bg-black px-5 py-2.5 rounded-xl border border-transparent hover:border-black"
                >
                  Selesai
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
