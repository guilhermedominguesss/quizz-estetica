import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type QuizStep = 'capture' | 'quiz' | 'radar' | 'lp';

export interface UserData {
  name: string;
  businessName: string;
  whatsapp: string;
}

export interface QuizAnswers {
  niche: string;
  weeklyClients: string;
  acquisitionChannel: string;
  mainDifficulty: string;
  revenueGoal: string;
  finalWhatsapp: string;
  consent: boolean;
}

interface QuizStore {
  step: QuizStep;
  userData: UserData;
  answers: Partial<QuizAnswers>;
  currentQuestionIndex: number;
  
  setStep: (step: QuizStep) => void;
  setUserData: (data: UserData) => void;
  setAnswer: (key: keyof QuizAnswers, value: any) => void;
  nextQuestion: () => void;
  reset: () => void;
  
  // Mock metrics for dashboard
  metrics: {
    questionsAnswered: number;
    abandonedAt: string | null;
  };
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      step: 'capture',
      userData: { name: '', businessName: '', whatsapp: '' },
      answers: {},
      currentQuestionIndex: 0,
      metrics: { questionsAnswered: 0, abandonedAt: null },

      setStep: (step) => set({ step }),
      setUserData: (data) => set({ userData: data }),
      setAnswer: (key, value) => set((state) => ({
        answers: { ...state.answers, [key]: value },
        metrics: { ...state.metrics, questionsAnswered: state.metrics.questionsAnswered + 1 }
      })),
      nextQuestion: () => set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),
      reset: () => set({
        step: 'capture',
        userData: { name: '', businessName: '', whatsapp: '' },
        answers: {},
        currentQuestionIndex: 0,
        metrics: { questionsAnswered: 0, abandonedAt: null }
      }),
    }),
    {
      name: 'beauty-quiz-storage',
    }
  )
);
