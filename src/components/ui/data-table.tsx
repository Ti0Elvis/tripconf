/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { createContext, useContext, useState } from "react";

interface Context {
  name: string;
  data: Array<any>;
  columns: Array<ColumnDef<any>>;
  table: Table<any>;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}

export const DataTableContext = createContext<Context | null>(null);

interface Props {
  children: React.ReactNode;
  name: string;
  data: Array<any>;
  columns: Array<ColumnDef<any>>;
}

export function DataTableProvider({ children, ...props }: Readonly<Props>) {
  const [globalFilter, setGlobalFilter] = useState("");

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      globalFilter,
    },
  });

  const context: Context = {
    ...props,
    table,
    globalFilter,
    setGlobalFilter,
  };

  return (
    <DataTableContext.Provider value={context}>
      {children}
    </DataTableContext.Provider>
  );
}

export function DataTable() {
  const { columns, table } = useContext(DataTableContext)!;

  return (
    <section className="rounded-md border">
      <TableComponent>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableComponent>
    </section>
  );
}

export function DataTableGlobalInput({
  className,
}: React.ComponentProps<"input">) {
  const { globalFilter, setGlobalFilter } = useContext(DataTableContext)!;

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

export function Pagination() {
  const { table } = useContext(DataTableContext)!;

  return (
    <section className="flex items-center justify-end space-x-2 my-4">
      <Button
        variant="outline"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}>
        Previous
      </Button>
      <Button
        variant="outline"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}>
        Next
      </Button>
    </section>
  );
}
