"use client";

import { createContext, useContext, type ReactNode } from "react";

export type AuthSessionUser = {
  id: string;
  email: string;
};

type AuthSessionContextValue = {
  user: AuthSessionUser;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

type AuthSessionProviderProps = {
  children: ReactNode;
  user: AuthSessionUser;
};

export function AuthSessionProvider({
  children,
  user
}: AuthSessionProviderProps) {
  return (
    <AuthSessionContext.Provider value={{ user }}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }

  return context;
}
