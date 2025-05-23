"use client";
import { LoaderCircleIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, Fragment, useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const { push } = useRouter();

  useEffect(() => {
    if (pathname === "/sign-in" && isLogin === true) {
      push("/");
    }

    if (pathname !== "/sign-in" && isLogin === false) {
      push("/sign-in");
    }

    setLoading(false);
  }, [isLogin, pathname]);

  const context: Context = {
    isLogin,
    setIsLogin,
  };

  return (
    <AuthContext.Provider value={context}>
      {loading ? (
        <span className="flex h-screen w-full items-center justify-center">
          <LoaderCircleIcon className="animate-spin" />
          <p>Loading...</p>
        </span>
      ) : (
        <Fragment>{children}</Fragment>
      )}
    </AuthContext.Provider>
  );
}
