import { addDays } from "date-fns";
import { Day } from "@prisma/client";

export function getDay(index: number, night: number): Day {
  switch (index) {
    case 0:
      return "first";
    case night - 1:
      return "last";
    default:
      return "default";
  }
}

// ci -> check_in
// co -> check_out
export function getDate(day: Day, ci: Date, co: Date, i: number): Date {
  switch (day) {
    case "first":
      return ci;
    case "default":
      return addDays(ci, i);
    default:
      return addDays(co, -1);
  }
}
