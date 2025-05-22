"use client";
import { createContext, useState } from "react";

interface Context {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<null | Context>(null);

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [isLogin, setIsLogin] = useState(false);

  const context: Context = {
    isLogin,
    setIsLogin,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}
