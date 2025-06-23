"use client";
import { ColumnDef } from "@tanstack/react-table";
import type { ServiceCategory } from "@prisma/client";
// @components
import { Checkbox } from "@/components/ui/checkbox";
import { ServiceCategoryActions } from "@/components/services-categories/actions";
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
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ServiceCategoryActions
          serviceCategory={row.original as ServiceCategory}
        />
      );
    },
  },
];
