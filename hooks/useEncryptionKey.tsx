// hooks/useEncryptionKey.ts
import { useEffect, useState } from "react";
import { useMasterPasswordStore } from "@/lib/stores/masterPasswordStore";
import { deriveKeyFromPassword } from "@/lib/crypto/encryption";

export function useEncryptionKey() {
  const { password } = useMasterPasswordStore();
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function derive() {
      if (!password) {
        setKey(null);
        return;
      }
      setLoading(true);
      try {
        const derivedKey = await deriveKeyFromPassword(password);
        setKey(derivedKey);
      } catch (err) {
        console.error("Error deriving key from password:", err);
        setKey(null);
      } finally {
        setLoading(false);
      }
    }

    derive();
  }, [password]);

  return { key, loading };
}
