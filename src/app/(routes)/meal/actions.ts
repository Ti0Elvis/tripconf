"use server";
import { z } from "zod";
import { db } from "@/db/supabase";
import { schema } from "./components/meal-form";
import { Day, Meal, Type } from "@prisma/client";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";

export async function findAllMeals(): Promise<Array<Meal>> {
  return await db.meal.findMany();
}

export async function create(values: z.infer<typeof schema>) {
  try {
    const existingMeal = await db.meal.findUnique({
      where: {
        name_day_type: {
          name: values.name,
          day: values.day,
          type: values.type,
        },
      },
    });

    if (existingMeal !== null) {
      return { error: "The meal already exists" };
    }

    await db.meal.create({
      data: {
        ...values,
        cost: Number(values.cost),
      },
    });

    return { error: undefined };
  } catch (error) {
    return { error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE };
  }
}

export async function groupMealsByDay() {
  const meals = await findAllMeals();

  const lunches: Array<Meal> = [];
  const dinners: Array<Meal> = [];

  meals.forEach((e) => {
    if (e.type === Type.lunch) {
      lunches.push(e);
    } else {
      dinners.push(e);
    }
  });

  const filterMealsByDay = (day: Day) => {
    return {
      lunches: lunches.filter((e) => {
        return e.day === day;
      }),
      dinners: dinners.filter((e) => {
        return e.day === day;
      }),
    };
  };

  return {
    first: filterMealsByDay("first"),
    default: filterMealsByDay("default"),
    last: filterMealsByDay("last"),
  };
}
