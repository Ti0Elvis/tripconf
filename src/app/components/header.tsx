import Link from "next/link";
import { Sheet } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export function Header() {
  return (
    <Sheet>
      <header className="w-full h-16 sticky top-0 shadow-sm z-50 border-b bg-background">
        <MaxWidthWrapper className="w-full flex items-center justify-between">
          <Link href="/">
            <span className="font-bold text-primary text-2xl">Tripconf</span>
          </Link>
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </MaxWidthWrapper>
      </header>
    </Sheet>
  );
}
