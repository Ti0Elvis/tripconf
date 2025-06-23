"use client";
import Link from "next/link";
import { deleteCookie } from "cookies-next";
import { AlignJustifyIcon } from "lucide-react";
// @components
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { MaxWidthWrapper } from "./max-width-wrapper";
// @hooks
import { useToast } from "@/hooks/use-toast";
import { useGlobal } from "@/hooks/use-global";
// @libs
import { delay } from "@/lib/utils";

export function Header() {
  const { dismiss } = useToast();
  const { isLogin } = useGlobal();

  return (
    <Sheet>
      <header className="w-full h-16 sticky top-0 shadow-sm z-50 border-b bg-background">
        <MaxWidthWrapper className="w-full flex items-center justify-between">
          <Link href="/">
            <span className="text-primary font-bold text-2xl">Tripconf</span>
          </Link>
          <div className="flex items-center gap-2">
            {isLogin === true && (
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" onClick={() => dismiss()}>
                  <AlignJustifyIcon />
                </Button>
              </SheetTrigger>
            )}
            <ModeToggle />
          </div>
        </MaxWidthWrapper>
      </header>
      {isLogin === true && (
        <SheetContent className="flex flex-col">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="hidden" />
          <section className="py-12 flex-grow flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={async () => {
                    deleteCookie("token");

                    await delay(250);
                    window.location.href = "/login";
                  }}>
                  Log out
                </Button>
              </SheetClose>
              <hr />
              <SheetClose asChild>
                <Button variant="outline" asChild>
                  <Link href="/preventives" prefetch>
                    Preventives
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="outline" asChild>
                  <Link href="/meals" prefetch>
                    Meals
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="outline" asChild>
                  <Link href="/services" prefetch>
                    Services
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="outline" asChild>
                  <Link href="/services-categories" prefetch>
                    Services categories
                  </Link>
                </Button>
              </SheetClose>
            </div>
            <SheetClose asChild>
              <Button asChild>
                <Link href="/preventives/create">Create your preventive</Link>
              </Button>
            </SheetClose>
          </section>
        </SheetContent>
      )}
    </Sheet>
  );
}
