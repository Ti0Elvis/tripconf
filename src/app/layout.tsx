import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
// @components
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
// @context
import { GlobalProvider } from "@/context/global";

const roboto = Roboto({
  weight: ["500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tripconf",
};

export const dynamic = "force-dynamic";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
        <GlobalProvider>
          <Header />
          <main className="w-full min-h-[calc(100vh-4rem)] py-8 tracking-tight whitespace-pre-wrap break-words">
            <MaxWidthWrapper>{children}</MaxWidthWrapper>
          </main>
        </GlobalProvider>
        <Toaster />
      </body>
    </html>
  );
}
