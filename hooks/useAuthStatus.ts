"use client";

import { useState, useEffect } from "react";
import { useAccountStore } from "@/lib/stores/accountStore";
import { useMasterPasswordStore } from "@/lib/stores/masterPasswordStore";
import { getAuthToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  address: string;
  exp: number;
};

export function useAuthStatus() {
  const { currentAccount } = useAccountStore();
  const { password: masterPassword } = useMasterPasswordStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    
    if (!token || !currentAccount?.address || !masterPassword) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const payload = jwtDecode<JwtPayload>(token);
      const isTokenValid = payload?.address === currentAccount.address && payload.exp > Date.now() / 1000;
      setIsAuthenticated(isTokenValid);
    } catch (error) {
      console.error("Error decoding token:", error);
      setIsAuthenticated(false);
    }
  }, [currentAccount, masterPassword]);

  return {
    isFullyAuthenticated: isAuthenticated,
    hasToken: !!getAuthToken(),
    hasAccount: !!currentAccount,
    hasMasterPassword: !!masterPassword,
  };
}
