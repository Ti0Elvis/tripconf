// @libs
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MaxWidthWrapper({ className, ...props }: Readonly<Props>) {
  return (
    <div className="w-full max-w-screen-xl h-full mx-auto">
      <section
        {...props}
        className={cn("w-full h-full px-8 md:px-20", className)}>
        {props.children}
      </section>
    </div>
  );
}
