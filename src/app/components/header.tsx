"use client";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useContext } from "react";
import { deleteCookie } from "cookies-next";
import { AuthContext } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { AlignJustifyIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

const ROUTES = [
  { name: "Preventives", path: "/preventive" },
  { name: "Meals", path: "/meal" },
  { name: "Services", path: "/service" },
  { name: "Service Categories", path: "/service-category" },
];

export function Header() {
  const { isLogin } = useContext(AuthContext)!;

  return (
    <Sheet>
      <header className="w-full h-16 sticky top-0 shadow-sm z-50 border-b bg-background">
        <MaxWidthWrapper className="w-full flex items-center justify-between">
          <Link href="/">
            <span className="font-bold text-primary text-2xl">Tripconf</span>
          </Link>
          <div className="flex items-center gap-2">
            {isLogin === true && (
              <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                  <AlignJustifyIcon />
                </Button>
              </SheetTrigger>
            )}
            <ModeToggle />
          </div>
        </MaxWidthWrapper>
      </header>
      {isLogin === true && (
        <SheetContent className="py-12 px-4">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="hidden" />
          <div className="py-4 flex-grow flex flex-col justify-between">
            <section className="flex flex-col gap-4">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    deleteCookie("token");
                    window.location.href = "/sign-in";
                  }}>
                  Logout
                </Button>
              </SheetClose>
              <hr />
              {ROUTES.map((route) => (
                <SheetClose key={route.path} asChild>
                  <Link href={route.path} prefetch>
                    <Button variant="outline" className="w-full">
                      {route.name}
                    </Button>
                  </Link>
                </SheetClose>
              ))}
            </section>
            <SheetClose asChild>
              <Link href="/preventive/create">
                <Button className="w-full">Create your preventive</Button>
              </Link>
            </SheetClose>
          </div>
        </SheetContent>
      )}
    </Sheet>
  );
}
