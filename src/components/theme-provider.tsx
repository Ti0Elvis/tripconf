"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface Props extends React.ComponentProps<typeof NextThemesProvider> {
  children: React.ReactNode;
}

export function ThemeProvider({ children, ...props }: Readonly<Props>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
