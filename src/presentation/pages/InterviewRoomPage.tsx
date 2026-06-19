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
  
  // Use a fallback question if no questions are loaded yet
  const currentQuestion = questions.length > 0 
    ? questions[currentQuestionIndex] 
    : "Ceritakan tentang diri Anda dan pengalaman kerja Anda sebelumnya.";
  
  const displayPosition = position || "Posisi Pekerjaan";
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = questions.length > 0 ? questions.length : 5;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Interview Session</h1>
          <p className="text-gray-500">{displayPosition}</p>
        </div>
        <div className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
          Pertanyaan {questionNumber} dari {totalQuestions}
        </div>
      </div>

      {/* Browser Support Warning */}
      {!isSupported && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm">Browser Anda tidak mendukung Web Speech API. Silakan gunakan Google Chrome untuk fitur ini.</p>
        </div>
      )}

      {/* Microphone/API Error Warning */}
      {error && isSupported && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Main Bento Grid */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300">
        
        {/* AI Question Section */}
        <div className="p-8 border-b border-gray-200 bg-gray-50">
          <p className="text-lg font-medium text-gray-800 leading-relaxed">
            "{currentQuestion}"
          </p>
        </div>

        {/* User Answer / STT Section */}
        <div className="p-8 min-h-[300px] flex flex-col justify-between">
          <div className="flex-grow">
            {isRecording || transcript ? (
              <p className="text-gray-700 leading-relaxed text-lg">
                {transcript}
                {isRecording && (
                  <span className="w-1.5 h-5 bg-blue-500 inline-block ml-1 animate-pulse align-middle" />
                )}
              </p>
            ) : isProcessing ? (
              <div className="flex items-center justify-center h-full space-x-3 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span className="animate-pulse">Memproses jawaban...</span>
              </div>
            ) : (
              <p className="text-gray-400">Klik ikon mikrofon di bawah untuk mulai menjawab.</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <div className="text-sm text-gray-500 w-24">
              {isRecording && (
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse ring-2 ring-red-100"></span> 
                  Merekam
                </span>
              )}
            </div>
            
            {/* Record Button */}
            <button 
              onClick={toggleRecording}
              disabled={isProcessing || !isSupported}
              className={`flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${
                isRecording 
                  ? 'bg-red-50 text-red-500 hover:bg-red-100 shadow-inner scale-95 border border-red-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-xl hover:-translate-y-1'
              } ${(isProcessing || !isSupported) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            >
              {isRecording ? <Square className="w-6 h-6" fill="currentColor" /> : <Mic className="w-7 h-7" />}
            </button>

            <div className="w-24 text-right">
              <Link to="/report" className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                Selesai
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
