// auth.ts
export function setAuthToken(token: string) {
  localStorage.setItem("authToken", token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

export function clearAuthToken() {
  localStorage.removeItem("authToken");
}