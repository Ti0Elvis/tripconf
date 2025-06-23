"use client";
// @components
import { Button } from "../ui/button";
// @hooks
import { useToast } from "@/hooks/use-toast";
import { useDataTable } from "@/hooks/use-data-table";

export function Pagination() {
  const { table } = useDataTable();
  const { dismiss } = useToast();

  return (
    <section className="flex items-center justify-end space-x-2 my-4">
      <Button
        variant="outline"
        onClick={() => {
          dismiss();
          table.previousPage();
        }}
        disabled={!table.getCanPreviousPage()}>
        Previous
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          dismiss();
          table.nextPage();
        }}
        disabled={!table.getCanNextPage()}>
        Next
      </Button>
    </section>
  );
}
