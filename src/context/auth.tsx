"use client";
import { jwtVerify } from "jose";
import { getCookie } from "cookies-next";
import { JWT_SECRET } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { createContext, useEffect, useState } from "react";

const secret = new TextEncoder().encode(JWT_SECRET);

interface Context {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<null | Context>(null);

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = getCookie("token") as string | undefined;

    if (token !== undefined) {
      const verifyToken = async () => {
        try {
          await jwtVerify(token, secret);
          setIsLogin(true);
        } catch (error) {
          console.error(error);
          setIsLogin(false);
        }
      };

      verifyToken();
    }
  }, [isLogin, pathname]);

  const context: Context = {
    isLogin,
    setIsLogin,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}
