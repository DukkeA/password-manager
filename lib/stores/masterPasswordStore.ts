import { create } from "zustand";

interface MasterPasswordState {
  password: string | null;
  setPassword: (password: string) => void;
  clearPassword: () => void;
}

export const useMasterPasswordStore = create<MasterPasswordState>((set) => ({
  password: null,
  setPassword: (password) => set({ password }),
  clearPassword: () => set({ password: null }),
}));
