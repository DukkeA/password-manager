/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { web3FromAddress } from "@polkadot/extension-dapp";
import { useAccountStore } from "@/lib/stores/accountStore";
import { setAuthToken } from "@/lib/auth";
import axios from "axios";
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
import { useAuthStatus } from "@/hooks/useAuthStatus";

export function WalletLoginButton() {
  const { currentAccount } = useAccountStore();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const { setPassword } = useMasterPasswordStore();
  const { isFullyAuthenticated, hasToken } = useAuthStatus();

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
    setInputPassword("");
    setShowPasswordDialog(false);
    toast.success("Logged in successfully");
  };

  return (
    <>
      <button
        onClick={handleLogin}
        className={`px-4 py-2 rounded ${
          isFullyAuthenticated ? "bg-green-600" : "bg-blue-600"
        } text-white`}
        disabled={isFullyAuthenticated || hasToken}
      >
        {isFullyAuthenticated 
          ? "Authenticated" 
          : hasToken 
          ? "Enter Master Password"
          : "Login with Wallet"
        }
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmitPassword();
              }
            }}
          />
          <Button onClick={handleSubmitPassword} className="mt-4 w-full">
            Confirm
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
