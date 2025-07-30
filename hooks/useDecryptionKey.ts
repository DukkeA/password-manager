import { useEffect, useState } from "react";
import {
  signWithWallet,
  deriveKeyFromSignature,
} from "@/lib/crypto/encryption";
import { useAccountStore } from "@/lib/stores/accountStore";

export function useDecryptionKey() {
  const { currentAccount } = useAccountStore();
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("useDecryptionKey - currentAccount:", currentAccount);
    
    if (!currentAccount) {
      console.log("No current account available");
      return;
    }

    const generateKey = async () => {
      try {
        console.log("Starting key generation for address:", currentAccount.address);
        setLoading(true);
        
        const message = `password-manager-${currentAccount.address}`;
        console.log("Signing message:", message);
        
        const signature = await signWithWallet(currentAccount.address, message);
        console.log("Signature obtained:", signature);
        
        const derivedKey = await deriveKeyFromSignature(signature);
        console.log("Key derived successfully:", !!derivedKey);
        
        setKey(derivedKey);
        setLoading(false);
      } catch (error) {
        console.error("Error generating decryption key:", error);
        setLoading(false);
      }
    };

    generateKey();
  }, [currentAccount]);

  return { key, loading };
}
