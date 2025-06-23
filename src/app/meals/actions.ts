"use server";
import _ from "lodash";
import type { Meal } from "@prisma/client";
// @db
import { db } from "@/db/prisma";
// @libs
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";
// @types
import type { IGetMealsByGroup, IMeal, TMealForm } from "@/types/meal";

export async function getMeals() {
  return await db.meal.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function deleteMeals(ids: Array<string>) {
  try {
    if (ids.length === 0) {
      return { error: "The 'ids' array must not be empty" };
    }

    await db.meal.deleteMany({ where: { id: { in: ids } } });

    return { error: undefined };
  } catch (error) {
    return { error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE };
  }
}

export async function createMeal(meal: TMealForm) {
  try {
    const existingMeal = await db.meal.findUnique({
      where: {
        name_dayType_mealType: {
          name: meal.name,
          dayType: meal.dayType,
          mealType: meal.mealType,
        },
      },
    });

    if (!!existingMeal === true) {
      return { error: "The meal already exists" };
    }

    await db.meal.create({
      data: {
        ...meal,
        cost: Number(meal.cost),
      },
    });

    return { error: undefined };
  } catch (error) {
    return { error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE };
  }
}

export async function updateMeal(id: string, meal: TMealForm) {
  try {
    const currentMeal = await db.meal.findUnique({
      where: { id },
    });

    if (!!currentMeal === false) {
      return { error: "Meal not found" };
    }

    const updatedData: Partial<TMealForm> = Object.fromEntries(
      Object.entries(meal).filter(
        ([key, value]) =>
          value !== (currentMeal as Record<string, unknown>)[key],
      ),
    );

    const nameChanged = "name" in updatedData;
    const mealTypeChanged = "mealType" in updatedData;
    const dayTypeChanged = "dayType" in updatedData;

    if (
      nameChanged === true ||
      mealTypeChanged === true ||
      dayTypeChanged === true
    ) {
      const existingMeal = await db.meal.findUnique({
        where: {
          name_dayType_mealType: {
            name: updatedData.name ?? currentMeal.name,
            dayType: updatedData.dayType ?? currentMeal.dayType,
            mealType: updatedData.mealType ?? currentMeal.mealType,
          },
        },
      });

      if (!!existingMeal === true && existingMeal.id !== id) {
        return { error: "The meal already exists" };
      }
    }

    await db.meal.update({
      where: { id },
      data: { ...updatedData, cost: Number(updatedData.cost) },
    });

    return { error: undefined };
  } catch (error) {
    return { error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE };
  }
}

export async function getMealsByGroup(): Promise<IGetMealsByGroup | undefined> {
  const meals = await db.meal.findMany();

  const groupedByDay = _.groupBy(meals, "dayType");

  const defaultMenu = { lunches: [], dinners: [] };

  const groupMeals = (meals: Array<Meal>) => {
    const groupedByMealType = _.groupBy(meals, "mealType");

    return {
      lunches: groupedByMealType["lunch"] || [],
      dinners: groupedByMealType["dinner"] || [],
    };
  };

  return {
    first_day: groupMeals(groupedByDay["first_day"]) || defaultMenu,
    default_day: groupMeals(groupedByDay["default_day"]) || defaultMenu,
    last_day: groupMeals(groupedByDay["last_day"]) || defaultMenu,
  };
}

export async function checkAndSetMeals(meals: Array<IMeal>) {
  try {
    const newMeals = await Promise.all(
      meals.map(async (item) => {
        const obj = { ...item };

        if (item.lunch !== null) {
          const existingLunch = await db.meal.findUnique({
            where: {
              name_dayType_mealType: {
                name: item.lunch.name,
                dayType: item.lunch.dayType,
                mealType: item.lunch.mealType,
              },
            },
          });

          obj.lunch = existingLunch;
        }

        if (item.dinner !== null) {
          const existingDinner = await db.meal.findUnique({
            where: {
              name_dayType_mealType: {
                name: item.dinner.name,
                dayType: item.dinner.dayType,
                mealType: item.dinner.mealType,
              },
            },
          });

          obj.dinner = existingDinner;
        }

        return obj;
      }),
    );

    return { newMeals, error: undefined };
  } catch (error) {
    return {
      newMeals: undefined,
      error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE,
    };
  }
}
