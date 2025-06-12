"use server";
import { z } from "zod";
import { db } from "@/db/supabase";
import { schema } from "./components/service-form";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";

export async function findAllServices() {
  return await db.service.findMany({
    include: { category: true },
  });
}

export async function create(values: z.infer<typeof schema>) {
  try {
    const existingService = await db.service.findUnique({
      where: {
        name_categoryId: {
          name: values.name,
          categoryId: Number(values.categoryId),
        },
      },
    });

    if (existingService !== null) {
      return { error: "There is a service with this name" };
    }

    await db.service.create({
      data: {
        ...values,
        categoryId: Number(values.categoryId),
        vanCost: Number(values.vanCost),
        groupCost: Number(values.groupCost),
        costPerPerson: Number(values.costPerPerson),
      },
    });

    return { error: undefined };
  } catch (error) {
    console.error(error);
    return { error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE };
  }
}
