"use client";
import type { Service } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
// @components
import { Checkbox } from "@/components/ui/checkbox";
import { ServiceActions } from "@/components/services/actions";
// @types
import type { TData } from "@/types/data-table";

export const columns: Array<ColumnDef<TData>> = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        name="SELECT_ALL_ROWS"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        name={`SELECT_SINGLE_ROW_${row.original.id}`}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ServiceActions
          service={
            row.original as Service & {
              category: {
                name: string;
                id: string;
              };
            }
          }
        />
      );
    },
  },
];
