import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("token");
  },
}));
