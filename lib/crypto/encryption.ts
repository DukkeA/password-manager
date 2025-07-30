import { web3FromAddress } from "@polkadot/extension-dapp";

export async function signWithWallet(
  address: string,
  message: string
): Promise<string> {
  const injector = await web3FromAddress(address);
  const hexMessage = `0x${Buffer.from(message).toString("hex")}`;

  if (!injector.signer || typeof injector.signer.signRaw !== "function") {
    throw new Error("Wallet signer or signRaw method is not available.");
  }

  const signed = await injector.signer.signRaw({
    address,
    data: hexMessage,
    type: "bytes",
  });

  return signed.signature;
}

export async function deriveKeyFromSignature(
  signature: string
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(signature));
  return crypto.subtle.importKey("raw", hash, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encryptPassword(
  key: CryptoKey,
  password: string
): Promise<{ ciphertext: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(password);

  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertextBuffer))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

export async function decryptPassword(
  key: CryptoKey,
  ciphertext: string,
  iv: string
): Promise<string> {
  const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
  const cipherBytes = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBytes },
    key,
    cipherBytes
  );
  return new TextDecoder().decode(decrypted);
}
