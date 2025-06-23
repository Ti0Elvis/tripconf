"use server";
import type { Service } from "@prisma/client";
// @db
import { db } from "@/db/prisma";
// @libs
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";
// @types
import type { TServiceForm } from "@/types/service";

export async function getServices() {
  return await db.service.findMany({
    include: { category: true },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function deleteServices(ids: Array<string>) {
  try {
    if (ids.length === 0) {
      return { error: "The 'ids' array must not be empty" };
    }

    await db.service.deleteMany({ where: { id: { in: ids } } });

    return { error: undefined };
  } catch (error) {
    return { error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE };
  }
}

export async function createService(service: TServiceForm) {
  try {
    const existingService = await db.service.findUnique({
      where: {
        name_categoryId: {
          name: service.name,
          categoryId: service.categoryId,
        },
      },
    });

    if (!!existingService === true) {
      return { error: "There is a service with this name" };
    }

    await db.service.create({
      data: {
        ...service,
        costPerPerson: Number(service.costPerPerson),
        groupCost: Number(service.groupCost),
        vanCost: Number(service.vanCost),
      },
    });

    return { error: undefined };
  } catch (error) {
    return { error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE };
  }
}

export async function updateService(id: string, service: TServiceForm) {
  try {
    const currentService = await db.service.findUnique({
      where: { id },
    });

    if (!!currentService === false) {
      return { error: "Service not found" };
    }

    const updatedData: Partial<TServiceForm> = Object.fromEntries(
      Object.entries(service).filter(
        ([key, value]) =>
          value !== (currentService as Record<string, unknown>)[key],
      ),
    );

    const nameChanged = "name" in updatedData;
    const categoryChanged = "categoryId" in updatedData;

    if (nameChanged === true || categoryChanged === true) {
      const existingService = await db.service.findUnique({
        where: {
          name_categoryId: {
            name: updatedData.name ?? currentService.name,
            categoryId: updatedData.categoryId ?? currentService.categoryId,
          },
        },
      });

      if (!!existingService === true && existingService.id !== id) {
        return { error: "The service already exists" };
      }
    }

    await db.service.update({
      where: {
        id,
      },
      data: {
        ...updatedData,
        costPerPerson: Number(updatedData.costPerPerson),
        groupCost: Number(updatedData.groupCost),
        vanCost: Number(updatedData.vanCost),
      },
    });

    return { error: undefined };
  } catch (error) {
    return { error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE };
  }
}

export async function checkAndSetServices(services: Array<Service>) {
  try {
    const newServices: Array<Service> = (
      await Promise.all(
        services.map(async (item) => {
          const existingService = await db.service.findUnique({
            where: {
              name_categoryId: {
                name: item.name,
                categoryId: item.categoryId,
              },
            },
          });

          if (existingService !== null) {
            return item;
          }

          return undefined;
        }),
      )
    ).filter((item) => item !== undefined);

    return {
      newServices,
      error: undefined,
    };
  } catch (error) {
    return {
      newServices: undefined,
      error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE,
    };
  }
}
