import { Link, useNavigate } from 'react-router-dom';
import { Mic, Square, Loader2, AlertCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useInterviewStore } from '../../store/useInterviewStore';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { useAuth } from '../../context/AuthContext';

export default function InterviewRoomPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    position,
    questions,
    currentQuestionIndex,
    transcript,
    status,
    setStatus,
    saveCurrentAnswerFeedback,
    nextQuestion,
    finishInterview,
    clearTranscript
  } = useInterviewStore();

  const {
    isSupported,
    isRecording,
    error,
    toggleRecording
  } = useSpeechToText();

  const [evaluationError, setEvaluationError] = useState<string | null>(null);

  const isProcessing = status === 'processing';
  
  // If we've answered all questions, we shouldn't be on this page, or we should show a completion screen.
  // For safety, let's redirect to report if index out of bounds.
  if (questions.length > 0 && currentQuestionIndex >= questions.length) {
    navigate('/report');
    return null;
  }

  const currentQuestion = questions.length > 0 
    ? questions[currentQuestionIndex] 
    : "Ceritakan tentang proyek paling menantang yang pernah Anda tangani dan bagaimana pendekatan Anda dalam menyelesaikannya.";
  
  const displayPosition = position || "Posisi Pekerjaan";
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = questions.length > 0 ? questions.length : 5;
  const progressPercentage = (questionNumber / totalQuestions) * 100;


  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) {
      setEvaluationError('Jawaban kosong. Silakan gunakan mikrofon untuk merekam jawaban Anda.');
      return;
    }

    setStatus('processing');
    setEvaluationError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('evaluate-answer', {
        body: {
          position: displayPosition,
          question: currentQuestion,
          answer: transcript
        }
      });

      if (functionError) {
        throw new Error(`Edge Function Error: ${functionError.message}`);
      }

      const parsedScore = Number(data.score);
      if (!data || isNaN(parsedScore)) {
        throw new Error('Respons LLM Groq tidak valid (Format skor salah).');
      }

      // Save feedback
      saveCurrentAnswerFeedback(transcript, {
        score: parsedScore,
        feedback: data.feedback,
        corrections: data.corrections || [],
        strengths: data.strengths || [],
        improvements: data.improvements || []
      });

      // Proceed to next question or finish
      clearTranscript();
      
      if (currentQuestionIndex + 1 < totalQuestions) {
        nextQuestion();
      } else {
        // Calculate average score
        const allFeedbacks = useInterviewStore.getState().detailedFeedbacks;
        const totalScore = allFeedbacks.reduce((sum, item) => sum + (item.feedback?.score || 0), 0);
        const avgScore = totalScore / allFeedbacks.length;
        finishInterview(avgScore);
        navigate('/report');
      }

    } catch (err: any) {
      console.error(err);
      setEvaluationError(err.message || 'Gagal mengevaluasi jawaban.');
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black pb-24 pt-8 animate-fade-in-up">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-1">
              Halo, {user?.user_metadata?.full_name?.split(' ')[0] || 'Kandidat'}
            </h1>
            <p className="text-sm text-gray-500 font-medium">{displayPosition}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Progress {questionNumber}/{totalQuestions}</span>
              <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Warnings */}
        {!isSupported && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-rose-600" />
            <p className="text-sm font-semibold">Browser Anda tidak mendukung Web Speech API. Silakan gunakan Google Chrome untuk fitur ini.</p>
          </div>
        )}

        {(error || evaluationError) && isSupported && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-rose-600" />
            <p className="text-sm font-semibold">{error || evaluationError}</p>
          </div>
        )}

        {/* Main Interface Container - Bento Style */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col">
          
          {/* Question Section - Dot Grid Background */}
          <div className="dot-grid bg-gray-50 p-8 md:p-12 relative border-b border-gray-200">
            <div className="glow-orb glow-orb-blue w-64 h-64 top-0 left-0 animate-float-slow"></div>
            
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest bg-white border border-gray-200 px-3 py-1.5 rounded-md shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Pertanyaan {questionNumber}
                </span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed tracking-tight">
                "{currentQuestion}"
              </p>
            </div>
          </div>

          {/* User Answer / STT Section */}
          <div className="p-8 md:p-12 min-h-[350px] flex flex-col justify-between bg-white relative">
            
            <div className="flex-grow max-w-3xl">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
                  <span className="animate-pulse font-semibold text-sm uppercase tracking-widest text-gray-400">Mengevaluasi...</span>
                </div>
              ) : isRecording || transcript ? (
                <div className="prose prose-gray prose-lg max-w-none">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    {transcript}
                    {isRecording && (
                      <span className="w-2.5 h-5 bg-blue-500 inline-block ml-2 animate-pulse align-middle rounded-sm" />
                    )}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="font-semibold text-gray-400 text-lg">Siap untuk menjawab?</p>
                </div>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
              <div className="w-40 flex items-center">
                {isRecording && (
                  <div className="flex items-center gap-2.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 font-bold text-xs uppercase tracking-widest">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Merekam
                  </div>
                )}
              </div>
              
              {/* Primary Record Button */}
              <div className="relative">
                {isRecording && (
                   <div className="absolute inset-0 bg-gray-200 rounded-full animate-ping scale-150 duration-1000 opacity-40"></div>
                )}
                {!isProcessing && (
                  <button 
                    onClick={toggleRecording}
                    disabled={isProcessing || !isSupported}
                    className={`relative z-10 flex items-center justify-center w-20 h-20 rounded-full transition-all active:scale-95 shadow-md border border-gray-200 ${
                      isRecording 
                        ? 'bg-white text-red-500 border-2 border-red-100 shadow-red-500/10' 
                        : 'bg-black text-white hover:bg-gray-800'
                    } ${(isProcessing || !isSupported) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                  >
                    {isRecording ? <Square className="w-8 h-8" fill="currentColor" /> : <Mic className="w-8 h-8" />}
                  </button>
                )}
              </div>

              <div className="w-40 flex justify-end">
                {!isRecording && transcript.trim().length > 0 && !isProcessing && (
                  <button 
                    onClick={handleSubmitAnswer}
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-white transition-all bg-black hover:bg-gray-800 px-6 py-3 rounded-lg shadow-sm"
                  >
                    {questionNumber === totalQuestions ? 'Selesai' : 'Lanjut'}
                    <Send className="w-4 h-4" />
                  </button>
                )}
                {!isRecording && transcript.trim().length === 0 && !isProcessing && (
                  <Link 
                    to="/report" 
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors bg-white hover:bg-gray-50 px-5 py-2.5 rounded-lg border border-gray-200"
                  >
                    Akhiri Sesi
                  </Link>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
