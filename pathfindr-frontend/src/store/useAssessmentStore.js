import { create } from 'zustand';

export const useAssessmentStore = create((set) => ({
  answers: {},
  currentStep: 0,
  setAnswer: (questionId, answer) => set((state) => ({
    answers: { ...state.answers, [questionId]: answer }
  })),
  setStep: (step) => set({ currentStep: step }),
  resetAssessment: () => set({ answers: {}, currentStep: 0 })
}));
