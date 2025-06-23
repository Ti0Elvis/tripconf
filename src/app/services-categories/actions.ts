"use server";
// @db
import { db } from "@/db/prisma";
// @libs
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";
// @types
import type { TServiceCategoryForm } from "@/types/service-category";

export async function getServicesCategories() {
  return await db.serviceCategory.findMany({
    include: { services: true },
  });
}

export async function deleteServicesCategories(ids: Array<string>) {
  try {
    if (ids.length === 0) {
      return { error: "The 'ids' array must not be empty" };
    }

    await db.$transaction(async (item) => {
      await item.service.deleteMany({
        where: {
          categoryId: { in: ids },
        },
      });

      await item.serviceCategory.deleteMany({
        where: { id: { in: ids } },
      });
    });

    return { error: undefined };
  } catch (error) {
    return { error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE };
  }
}

export async function createServiceCategory(
  serviceCategory: TServiceCategoryForm,
) {
  try {
    const existingServiceCategory = await db.serviceCategory.findUnique({
      where: {
        name: serviceCategory.name,
      },
    });

    if (!!existingServiceCategory === true) {
      return { error: "There is a service category with this name" };
    }

    await db.serviceCategory.create({
      data: { ...serviceCategory },
    });

    return { error: undefined };
  } catch (error) {
    return { error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE };
  }
}

export async function updateServiceCategory(
  id: string,
  service: TServiceCategoryForm,
) {
  try {
    const currentServiceCategory = await db.serviceCategory.findUnique({
      where: { id },
    });

    if (!!currentServiceCategory === false) {
      return { error: "Service category not found" };
    }

    const updatedData: Partial<TServiceCategoryForm> = Object.fromEntries(
      Object.entries(service).filter(
        ([key, value]) =>
          value !== (currentServiceCategory as Record<string, unknown>)[key],
      ),
    );

    const nameChanged = "name" in updatedData;

    if (nameChanged === true) {
      const existingServiceCategory = await db.serviceCategory.findUnique({
        where: {
          name: updatedData.name ?? currentServiceCategory.name,
        },
      });

      if (
        !!existingServiceCategory === true &&
        existingServiceCategory.id !== id
      ) {
        return { error: "The service category already exists" };
      }
    }

    await db.serviceCategory.update({
      where: {
        id,
      },
      data: {
        ...updatedData,
      },
    });

    return { error: undefined };
  } catch (error) {
    return { error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE };
  }
}
