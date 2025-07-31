// lib/crypto/encryption.ts

/**
 * Derives an AES-GCM key from the user's master password
 */
export async function deriveKeyFromPassword(
  password: string
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKeyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const salt = encoder.encode("password-manager-static-salt"); // Can be made dynamic in the future

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    passwordKeyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts the user's password with the derived key
 */
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

/**
 * Decrypts the saved password with the derived key
 */
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
