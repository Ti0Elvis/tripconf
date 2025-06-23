"use client";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { createContext, useState } from "react";
import type { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
// @types
import type { IDataTableContext, TData } from "@/types/data-table";

export const DataTableContext = createContext<IDataTableContext | null>(null);

interface Props {
  children: React.ReactNode;
  name: string;
  data: Array<TData>;
  columns: Array<ColumnDef<TData>>;
}

export function DataTableProvider({ children, ...props }: Readonly<Props>) {
  const [globalFilter, setGlobalFilter] = useState("");

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageSize: 8,
    pageIndex: 0,
  });

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      globalFilter,
      pagination,
    },
  });

  const values: IDataTableContext = {
    ...props,
    table,
    globalFilter,
    setGlobalFilter,
  };

  return (
    <DataTableContext.Provider value={values}>
      {children}
    </DataTableContext.Provider>
  );
}
