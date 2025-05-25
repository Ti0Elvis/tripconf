"use server";
import { z } from "zod";
import {
  DAYS_TO_EXPIRE_TOKEN,
  JWT_SECRET,
  PASSWORD,
  USERNAME,
} from "@/lib/constants";
import { SignJWT } from "jose";
import { schema } from "./schema";

const secret = new TextEncoder().encode(JWT_SECRET);

export async function sign_in(values: z.infer<typeof schema>) {
  try {
    if (values.username !== USERNAME || values.password !== PASSWORD) {
      return { token: undefined, error: "Invalid username or password" };
    }

    const token = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(`${DAYS_TO_EXPIRE_TOKEN}d`)
      .sign(secret);

    return { token: token, error: undefined };
  } catch (error) {
    console.error("Error in sign_in:", error);
    return { token: undefined, error: "Internal error" };
  }
}
