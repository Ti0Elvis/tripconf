"use server";
import type { Service } from "@prisma/client";
import { isCuid } from "@paralleldrive/cuid2";
// @db
import { db } from "@/db/prisma";
// @libs
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";
// @types
import type { IMeal } from "@/types/meal";

export async function getPreventive(id: string) {
  try {
    if (!!isCuid(id) === false) {
      return { preventive: undefined, error: "Invalid ID" };
    }

    const preventive = await db.preventive.findUnique({
      where: { id },
    });

    if (!!preventive === false) {
      return { preventive: undefined, error: "Preventive not found" };
    }

    const meals = JSON.parse(String(preventive.meals) ?? "[]");
    const services = JSON.parse(String(preventive.services) ?? "[]");

    return {
      preventive: {
        ...preventive,
        meals: meals as Array<IMeal>,
        services: services as Array<Service>,
      },

      error: undefined,
    };
  } catch (error) {
    return {
      preventive: undefined,
      error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE,
    };
  }
}
