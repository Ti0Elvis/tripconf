import { Day, Meal } from "@prisma/client";

// This is only a type for parser
export interface DailyMeals {
  day: Day;
  date: Date;
  lunch: Meal | null;
  dinner: Meal | null;
}
