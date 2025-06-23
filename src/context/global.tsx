"use client";
import { jwtVerify } from "jose";
import { usePathname } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { createContext, useEffect, useState } from "react";
// @components
import { QueryProvider } from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
// @hooks
import { useToast } from "@/hooks/use-toast";
// @libs
import { JWT_SECRET } from "@/lib/constants";
// @types
import type { IGlobalContext } from "@/types/global";

const secret = new TextEncoder().encode(JWT_SECRET);

export const GlobalContext = createContext<IGlobalContext | null>(null);

interface Props {
  children: React.ReactNode;
}

export function GlobalProvider({ children }: Readonly<Props>) {
  const [isLogin, setIsLogin] = useState(false);

  const { dismiss } = useToast();
  const pathname = usePathname();

  const token = getCookie("token");

  useEffect(() => {
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

    if (token === undefined) {
      setIsLogin(false);
    }
  }, [token]);

  useEffect(() => {
    dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const props: IGlobalContext = {
    isLogin,
  };

  return (
    <GlobalContext.Provider value={props}>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </QueryProvider>
    </GlobalContext.Provider>
  );
}
