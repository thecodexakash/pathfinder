import { create } from 'zustand';

const answerStore = create((set) => ({
  answers: [], 
  addAnswer: (answerData) => {
    set((state) => ({
      answers: [...state.answers, answerData]
    }));
  },
  resetAnswers: () => set({ answers: [] }), 
}));

export default answerStore;
