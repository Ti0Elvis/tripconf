import type {
  Meal,
  Preventive,
  Service,
  ServiceCategory,
} from "@prisma/client";
import type { ColumnDef, Table } from "@tanstack/react-table";
// @types
import { TUseState } from "./index";

export type TPreventive = Omit<
  Preventive,
  "checkIn" | "checkOut" | "createdAt"
> & {
  checkIn: string;
  checkOut: string;
  createdAt: string;
};

export type TData = TPreventive | Meal | Service | ServiceCategory;

export interface IDataTableContext {
  name: string;
  data: Array<TData>;
  columns: Array<ColumnDef<TData>>;
  table: Table<TData>;
  globalFilter: string;
  setGlobalFilter: TUseState<string>;
}
