import { Link, useNavigate } from 'react-router-dom';
import { Mic, Square, Loader2, AlertCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useInterviewStore } from '../../store/useInterviewStore';
import { useSpeechToText } from '../../hooks/useSpeechToText';

export default function InterviewRoomPage() {
  const navigate = useNavigate();
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
    <div className="bg-transparent pb-8 animate-fade-in-up relative">
      
      {/* Very subtle top gradient wash */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10 rounded-3xl opacity-50"></div>
      
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:px-6 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              {questionNumber}
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">Wawancara Berlangsung</h1>
              <p className="text-sm text-slate-500 font-medium">{displayPosition}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</span>
              <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Warnings */}
        {!isSupported && (
          <div className="bg-slate-100 border border-slate-300 text-slate-800 p-4 rounded-xl flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm font-medium">Browser Anda tidak mendukung Web Speech API. Silakan gunakan Google Chrome untuk fitur ini.</p>
          </div>
        )}

        {(error || evaluationError) && isSupported && (
          <div className="bg-slate-100 border border-slate-300 text-slate-800 p-4 rounded-xl flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{error || evaluationError}</p>
          </div>
        )}

        {/* Main Interface Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
          
          {/* Question Section */}
          <div className="p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2.5 py-1 rounded-md bg-blue-100/50 text-blue-700 text-xs font-bold uppercase tracking-widest border border-blue-200/50">
                  Pertanyaan {questionNumber}
                </span>
              </div>
              <p className="text-2xl md:text-[28px] font-semibold text-slate-900 leading-[1.4] tracking-tight">
                "{currentQuestion}"
              </p>
            </div>
          </div>

          <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent w-full"></div>

          {/* User Answer / STT Section */}
          <div className="p-8 md:p-12 min-h-[350px] flex flex-col justify-between bg-slate-50/30 relative">
            
            <div className="flex-grow max-w-3xl">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="animate-pulse font-medium text-sm">Menyimpan respons & mengevaluasi dengan AI...</span>
                </div>
              ) : isRecording || transcript ? (
                <div className="prose prose-slate prose-lg">
                  <p className="text-slate-700 font-medium leading-[1.6]">
                    {transcript}
                    {isRecording && (
                      <span className="w-2 h-5 bg-blue-600 inline-block ml-2 animate-pulse align-middle rounded-sm" />
                    )}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="font-medium text-slate-400 text-lg">Siap untuk menjawab?</p>
                </div>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between mt-12">
              <div className="w-40 flex items-center">
                {isRecording && (
                  <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200/60 font-semibold text-sm shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                    Merekam
                  </div>
                )}
              </div>
              
              {/* Primary Record Button */}
              <div className="relative">
                {isRecording && (
                   <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping scale-150 duration-1000 opacity-40"></div>
                )}
                {!isProcessing && (
                  <button 
                    onClick={toggleRecording}
                    disabled={isProcessing || !isSupported}
                    className={`relative z-10 flex items-center justify-center w-20 h-20 rounded-full transition-all active:scale-95 shadow-md ${
                      isRecording 
                        ? 'bg-white text-blue-600 border-4 border-blue-100 shadow-blue-500/20' 
                        : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1'
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
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-white transition-all bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {questionNumber === totalQuestions ? 'Selesai' : 'Lanjut'}
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
                {!isRecording && transcript.trim().length === 0 && !isProcessing && (
                  <Link 
                    to="/report" 
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors bg-white hover:bg-slate-50 px-5 py-2.5 rounded-xl border border-transparent hover:border-slate-200"
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
