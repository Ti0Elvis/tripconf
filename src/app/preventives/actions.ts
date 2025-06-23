"use server";
import { format } from "date-fns";
// @db
import { db } from "@/db/prisma";
// @libs
import { DEFAULT_DATE_FORMATTER, DEFAULT_ERROR_MESSAGE } from "@/lib/constants";

export async function getPreventives() {
  const preventives = await db.preventive.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return preventives.map((item) => ({
    ...item,
    checkIn: format(new Date(item.checkIn), DEFAULT_DATE_FORMATTER),
    checkOut: format(new Date(item.checkOut), DEFAULT_DATE_FORMATTER),
    createdAt: format(new Date(item.createdAt), DEFAULT_DATE_FORMATTER),
  }));
}

export async function deletePreventives(ids: Array<string>) {
  try {
    if (ids.length === 0) {
      return { error: "The 'ids' array must not be empty" };
    }

    await db.preventive.deleteMany({
      where: { id: { in: ids } },
    });

    return { error: undefined };
  } catch (error) {
    return { error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE };
  }
}
