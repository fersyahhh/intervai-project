import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AiFeedback } from '../types/database.types';

export type InterviewStatus = 'setup' | 'idle' | 'recording' | 'processing' | 'completed';

interface QuestionFeedback {
  question: string;
  answer: string;
  feedback: AiFeedback | null;
}

interface InterviewState {
  // 1. Context Information (From Setup Page)
  interviewId: string | null;
  position: string;
  jobDescription: string;
  cvUrl: string | null;

  // 2. Real-time Interview Session Data
  status: InterviewStatus;
  questions: string[]; // List of questions for the session
  currentQuestionIndex: number;
  transcript: string; // Live Speech-to-Text transcript
  hesitationCount: number; // Detected silence gaps

  // 3. Final Results
  overallScore: number | null;
  detailedFeedbacks: QuestionFeedback[];

  // ==========================================
  // Actions
  // ==========================================
  
  // Setup Actions
  setInterviewContext: (
    id: string,
    position: string,
    jobDesc: string,
    cvUrl?: string | null
  ) => void;
  setQuestions: (questions: string[]) => void;

  // Real-time Session Actions
  setStatus: (status: InterviewStatus) => void;
  setTranscript: (text: string) => void;
  appendTranscript: (text: string) => void;
  clearTranscript: () => void;
  incrementHesitation: () => void;
  
  // Progression Actions
  saveCurrentAnswerFeedback: (answer: string, feedback: AiFeedback) => void;
  nextQuestion: () => void;
  finishInterview: (overallScore: number) => void;
  
  // Reset
  resetStore: () => void;
}

const initialState = {
  interviewId: null,
  position: '',
  jobDescription: '',
  cvUrl: null,
  status: 'setup' as InterviewStatus,
  questions: [],
  currentQuestionIndex: 0,
  transcript: '',
  hesitationCount: 0,
  overallScore: null,
  detailedFeedbacks: [],
};

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set) => ({
      ...initialState,

      setInterviewContext: (id, position, jobDesc, cvUrl = null) =>
        set({
          interviewId: id,
          position,
          jobDescription: jobDesc,
          cvUrl,
          status: 'idle',
          // Reset session-specific state for new interview
          currentQuestionIndex: 0,
          transcript: '',
          hesitationCount: 0,
          overallScore: null,
          detailedFeedbacks: [],
        }),

      setQuestions: (questions) => set({ questions }),

      setStatus: (status) => set({ status }),

      setTranscript: (text) => set({ transcript: text }),

      appendTranscript: (text) =>
        set((state) => ({
          transcript: state.transcript ? `${state.transcript} ${text}` : text,
        })),

      clearTranscript: () => set({ transcript: '' }),

      incrementHesitation: () =>
        set((state) => ({ hesitationCount: state.hesitationCount + 1 })),

      saveCurrentAnswerFeedback: (answer, feedback) =>
        set((state) => {
          const currentQ = state.questions[state.currentQuestionIndex];
          return {
            detailedFeedbacks: [
              ...state.detailedFeedbacks,
              { question: currentQ, answer, feedback },
            ],
          };
        }),

      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: state.currentQuestionIndex + 1,
          transcript: '',
          hesitationCount: 0, // Reset hesitation for the new question
          status: 'idle',
        })),

      finishInterview: (score) =>
        set({
          status: 'completed',
          overallScore: score,
        }),

      resetStore: () => set(initialState),
    }),
    {
      name: 'intervai-interview-storage',
    }
  )
);
