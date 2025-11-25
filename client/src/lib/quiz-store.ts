import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type QuizStep = 'capture' | 'quiz' | 'radar' | 'lp';

export interface UserData {
  name: string;
  businessName: string;
  whatsapp: string;
}

export interface QuizAnswers {
  niche: string;
  currentDemand: string;      // Was weeklyClients
  onlinePresence: string;     // Was acquisitionChannel
  paidTrafficExperience: string; // New
  mainDifficulty: string;
  revenueGoal: string;
  finalWhatsapp: string;
  consent: boolean;
}

export type LeadStatus = 'captured' | 'quiz_in_progress' | 'quiz_completed' | 'radar_viewed' | 'clicked_whatsapp';

export interface Lead {
  id: string;
  userData: UserData;
  answers: Partial<QuizAnswers>;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

interface QuizStore {
  // Session State
  step: QuizStep;
  userData: UserData;
  answers: Partial<QuizAnswers>;
  currentQuestionIndex: number;
  currentLeadId: string | null;
  
  // Admin Data
  leads: Lead[];

  // Actions
  setStep: (step: QuizStep) => void;
  setUserData: (data: UserData) => void;
  setAnswer: (key: keyof QuizAnswers, value: any) => void;
  nextQuestion: () => void;
  reset: () => void;
  
  // Lead Management
  startNewLead: (data: UserData) => void;
  updateCurrentLeadStatus: (status: LeadStatus) => void;
  completeQuizForCurrentLead: (answers: Partial<QuizAnswers>) => void;
  resetAdminStats: () => void;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      step: 'capture',
      userData: { name: '', businessName: '', whatsapp: '' },
      answers: {},
      currentQuestionIndex: 0,
      currentLeadId: null,
      leads: [],

      setStep: (step) => set({ step }),
      setUserData: (data) => set({ userData: data }),
      setAnswer: (key, value) => set((state) => ({
        answers: { ...state.answers, [key]: value }
      })),
      nextQuestion: () => set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),
      
      reset: () => set({
        step: 'capture',
        userData: { name: '', businessName: '', whatsapp: '' },
        answers: {},
        currentQuestionIndex: 0,
        currentLeadId: null
      }),

      startNewLead: (data) => {
        const newLead: Lead = {
          id: uuidv4(),
          userData: data,
          answers: {},
          status: 'captured',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set((state) => ({
          userData: data,
          currentLeadId: newLead.id,
          leads: [newLead, ...state.leads],
          step: 'quiz' // Auto advance to quiz
        }));
      },

      updateCurrentLeadStatus: (status) => {
        const { currentLeadId, leads } = get();
        if (!currentLeadId) return;

        const updatedLeads = leads.map(lead => 
          lead.id === currentLeadId 
            ? { ...lead, status, updatedAt: new Date().toISOString() } 
            : lead
        );

        set({ leads: updatedLeads });
      },

      completeQuizForCurrentLead: (finalAnswers) => {
        const { currentLeadId, leads, answers } = get();
        if (!currentLeadId) return;

        const mergedAnswers = { ...answers, ...finalAnswers };

        const updatedLeads = leads.map(lead => 
          lead.id === currentLeadId 
            ? { 
                ...lead, 
                answers: mergedAnswers, 
                status: 'quiz_completed' as LeadStatus, 
                updatedAt: new Date().toISOString() 
              } 
            : lead
        );

        set({ 
          leads: updatedLeads,
          answers: mergedAnswers,
          step: 'radar'
        });
      },

      resetAdminStats: () => set({ leads: [] })
    }),
    {
      name: 'beauty-quiz-storage',
    }
  )
);
