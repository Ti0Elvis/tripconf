"use server";
import { z } from "zod";
import { schema } from "./schema";
import { PASSWORD, USERNAME } from "@/lib/constants";

export async function sign_in(values: z.infer<typeof schema>) {
  try {
    if (values.username !== USERNAME || values.password !== PASSWORD) {
      return { success: false, error: "Invalid username or password" };
    }

    return { success: true, error: undefined };
  } catch (error) {
    console.error("Error in sign_in:", error);
    return { success: false, error: "Internal error" };
  }
}
