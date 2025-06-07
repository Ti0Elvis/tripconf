"use server";
import { z } from "zod";
import { db } from "@/db/supabase";
import { Meal } from "@prisma/client";
import { schema } from "./components/meal-form";
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
      },
    });

    return { error: undefined };
  } catch (error) {
    return { error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE };
  }
}
