import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Header } from "./components/header";
import { AuthProvider } from "@/context/auth";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

const roboto = Roboto({ weight: ["500", "700", "900"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tripconf",
  creator: "Ti0Elvis",
  authors: [{ name: "Ti0Elvis", url: "https://github.com/Ti0Elvis" }],
};

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <AuthProvider>
            <Header />
            <QueryProvider>
              <main className="w-full min-h-[calc(100vh-4rem)] py-8 tracking-tight whitespace-pre-wrap break-words">
                <MaxWidthWrapper>{children}</MaxWidthWrapper>
              </main>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
