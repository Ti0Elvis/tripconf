"use server";
import { z } from "zod";
import { db } from "@/db/supabase";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";
import { schema } from "./components/service-category-form";

export async function findAllServicesCategories() {
  return await db.serviceCategory.findMany({
    include: { services: true },
  });
}

export async function create(values: z.infer<typeof schema>) {
  try {
    const existingServiceCategory = await db.serviceCategory.findUnique({
      where: {
        name: values.name,
      },
    });

    if (existingServiceCategory !== null) {
      return { error: "There is a service category with this name" };
    }

    await db.serviceCategory.create({
      data: { ...values },
    });

    return { error: undefined };
  } catch (error) {
    return { error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE };
  }
}
