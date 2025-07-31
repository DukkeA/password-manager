import { create } from "zustand";
import { useMasterPasswordStore } from "./masterPasswordStore";

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

export const useAccountStore = create<AccountState>((set, get) => ({
  accounts: [],
  currentAccount: null,
  setAccounts: (accounts) => set({ accounts }),
  setCurrentAccount: (account) => {
    const currentAccount = get().currentAccount;
    // Si está cambiando de cuenta, limpiar la clave maestra
    if (currentAccount && currentAccount.address !== account.address) {
      useMasterPasswordStore.getState().clearPassword();
    }
    set({ currentAccount: account });
  },
}));
