import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MaxWidthWrapper({ className, ...props }: Readonly<Props>) {
  return (
    <section
      className={cn(
        "w-full max-w-screen-xl h-full mx-auto px-8 md:px-16",
        className
      )}
      {...props}
    >
      {props.children}
    </section>
  );
}
