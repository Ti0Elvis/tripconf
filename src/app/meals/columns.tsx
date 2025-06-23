"use client";
import type { DayType, Meal } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
// @components
import { Checkbox } from "@/components/ui/checkbox";
import { MealActions } from "@/components/meals/actions";
// @libs
import { formatPrice } from "@/lib/utils";
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
    accessorKey: "dayType",
    header: "Day type",
    cell: (props) => {
      const dayType = props.getValue() as DayType;

      if (dayType === "first_day") {
        return "First day";
      } else if (dayType === "last_day") {
        return "Last day";
      } else {
        return "Default day";
      }
    },
  },
  {
    accessorKey: "mealType",
    header: "Meal type",
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: (props) => {
      return formatPrice((props.getValue() as number) ?? 0);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <MealActions meal={row.original as Meal} />;
    },
  },
];
