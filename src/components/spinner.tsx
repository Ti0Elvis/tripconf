import { LoaderCircleIcon } from "lucide-react";
// @libs
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLSpanElement>;

export function Spinner({ className, ...props }: Readonly<Props>) {
  return (
    <span className={cn(className)} {...props}>
      <LoaderCircleIcon className="animate-spin" />
      <p>Loading...</p>
    </span>
  );
}
