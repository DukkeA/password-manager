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
            Acceso Requerido
          </h2>
          <div className="space-y-2 text-gray-600">
            {!hasAccount && (
              <p>• Conecta tu cuenta de wallet</p>
            )}
            {!hasToken && hasAccount && (
              <p>• Inicia sesión con tu wallet</p>
            )}
            {!hasMasterPassword && hasToken && (
              <p>• Ingresa tu clave maestra</p>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Completa todos los pasos para acceder al gestor de contraseñas
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
