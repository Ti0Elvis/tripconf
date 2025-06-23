import { useContext } from "react";
// @context
import { DataTableContext } from "@/context/data-table";

export function useDataTable() {
  return useContext(DataTableContext)!;
}
