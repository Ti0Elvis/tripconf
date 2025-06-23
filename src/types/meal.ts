import { z } from "zod";
import type { DayType, Meal } from "@prisma/client";
// @libs
import { MealForm } from "@/lib/schemas";

export interface IMeal {
  date: Date;
  dayType: DayType;
  lunch: Meal | null;
  dinner: Meal | null;
}

export type TMealForm = z.infer<typeof MealForm>;

export interface IGetMealsByGroup {
  first_day: {
    lunches: Array<Meal>;
    dinners: Array<Meal>;
  };
  default_day: {
    lunches: Array<Meal>;
    dinners: Array<Meal>;
  };
  last_day: {
    lunches: Array<Meal>;
    dinners: Array<Meal>;
  };
}
