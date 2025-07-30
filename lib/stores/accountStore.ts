import { create } from "zustand";

export type Account = {
  address: string;
  name?: string;
  source?: string;
};

interface AccountState {
  accounts: Account[];
  currentAccount: Account | null;
  setAccounts: (accounts: Account[]) => void;
  setCurrentAccount: (account: Account) => void;
}

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [],
  currentAccount: null,
  setAccounts: (accounts) => set({ accounts }),
  setCurrentAccount: (account) => set({ currentAccount: account }),
}));
