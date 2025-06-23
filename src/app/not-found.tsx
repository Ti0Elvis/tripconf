import Link from "next/link";
// @components
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <section className="mt-40 text-center space-y-4">
      <h2 className="text-primary text-8xl font-extrabold lg:text-9xl">404</h2>
      <p className="text-3xl font-bold text-zinc-800 dark:text-gray-300 md:text-4xl">
        Something&#39;s missing.
      </p>
      <p className="font-light text-gray-500 dark:text-gray-400 lg:text-lg">
        Sorry, we can&#39;t find that page.
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </section>
  );
}
