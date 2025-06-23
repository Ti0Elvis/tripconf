"use client";
// @components
import { Input } from "../ui/input";
// @hooks
import { useDataTable } from "@/hooks/use-data-table";
// @libs
import { cn } from "@/lib/utils";

interface Props {
  className: string;
}

export function GlobalInput({ className }: Readonly<Props>) {
  const { globalFilter, setGlobalFilter } = useDataTable();

  return (
    <Input
      name="GLOBAL_INPUT"
      value={globalFilter}
      className={cn(className)}
      placeholder="Search globally..."
      onChange={(event) => setGlobalFilter(event.target.value)}
    />
  );
}
