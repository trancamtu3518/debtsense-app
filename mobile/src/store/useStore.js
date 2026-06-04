import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  profile: 'avoider',
  financialData: {
    totalDebt: 30000000,
    monthlyPayment: 600000,
    paidPercentage: 18
  },
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setFinancialData: (data) => set({ financialData: data })
}));

export default useStore;
