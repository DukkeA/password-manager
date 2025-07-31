/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { web3FromAddress } from "@polkadot/extension-dapp";
import { useAccountStore } from "@/lib/stores/accountStore";
import { setAuthToken, getAuthToken } from "@/lib/auth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMasterPasswordStore } from "@/lib/stores/masterPasswordStore";

type JwtPayload = {
  address: string;
  exp: number;
};

export function WalletLoginButton() {
  const { currentAccount } = useAccountStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const { setPassword } = useMasterPasswordStore();

  useEffect(() => {
    const token = getAuthToken();
    if (token && currentAccount?.address) {
      const payload = jwtDecode<JwtPayload>(token);
      if (payload?.address === currentAccount.address) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [currentAccount]);

  const handleLogin = async () => {
    if (!currentAccount) return;

    try {
      const message = "login-password-manager";
      const hexMessage = `0x${Buffer.from(message).toString("hex")}`;
      const injector = await web3FromAddress(currentAccount.address);

      if (!injector?.signer?.signRaw) {
        throw new Error("Wallet does not support raw signing.");
      }

      const { signature } = await injector.signer.signRaw({
        address: currentAccount.address,
        data: hexMessage,
        type: "bytes",
      });

      const response = await axios.post("/api/auth/login", {
        address: currentAccount.address,
        signature,
      });

      const token = response.data.token;
      setAuthToken(token);
      setIsAuthenticated(true);

      setShowPasswordDialog(true);
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error("Login failed");
    }
  };

  const handleSubmitPassword = () => {
    if (!inputPassword) {
      toast.error("You must enter a password");
      return;
    }
    setPassword(inputPassword);
    setShowPasswordDialog(false);
    toast.success("Logged in successfully");
  };

  return (
    <>
      <button
        onClick={handleLogin}
        className={`px-4 py-2 rounded ${
          isAuthenticated ? "bg-green-600" : "bg-blue-600"
        } text-white`}
        disabled={isAuthenticated}
      >
        {isAuthenticated ? "Authenticated" : "Login with Wallet"}
      </button>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your master password</DialogTitle>
          </DialogHeader>
          <Input
            type="password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            placeholder="Master password"
          />
          <Button onClick={handleSubmitPassword} className="mt-4 w-full">
            Confirm
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
