"use client";
import Link from "next/link";
// @components
import { Button } from "@/components/ui/button";
// @types
import type { IErrorPage } from "@/types/index";

export default function Page({ error, reset }: Readonly<IErrorPage>) {
  return (
    <section className="mt-40 space-y-4">
      <h2 className="text-primary text-4xl font-extrabold md:text-5xl lg:text-6xl">
        Something&#39;s were wrong
      </h2>
      <p className="text-xl text-zinc-800 dark:text-gray-300 md:text-2xl lg:text-3xl">
        Error message: {error.message}
      </p>
      <div className="flex items-center gap-4">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button variant="outline" onClick={reset}>
          Retry
        </Button>
      </div>
    </section>
  );
}
