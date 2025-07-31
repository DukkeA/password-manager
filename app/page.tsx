"use client";

import PasswordCreationForm from "@/components/password-creation-form";
import PasswordsTable from "@/components/passwords-table";
import { useAuthStatus } from "@/hooks/useAuthStatus";

export default function Home() {
  const { isFullyAuthenticated, hasAccount, hasToken, hasMasterPassword } = useAuthStatus();

  if (!isFullyAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            Access Required
          </h2>
          <div className="space-y-2 text-gray-600">
            {!hasAccount && (
              <p>• Connect your wallet account</p>
            )}
            {!hasToken && hasAccount && (
              <p>• Sign in with your wallet</p>
            )}
            {!hasMasterPassword && hasToken && (
              <p>• Enter your master password</p>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Complete all steps to access the password manager
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PasswordCreationForm />
      <PasswordsTable />
    </>
  );
}
