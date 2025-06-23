"use server";
import { SignJWT } from "jose";
import { compareSync } from "bcrypt";
// @libs
import {
  DAYS_TO_EXPIRE_TOKEN,
  DEFAULT_ERROR_MESSAGE,
  JWT_SECRET,
  TRIPCONF_PASSWORD,
  TRIPCONF_USERNAME,
} from "@/lib/constants";
// @types
import type { TLoginForm } from "@/types/login";

const secret = new TextEncoder().encode(JWT_SECRET);

const BCRYPT_PREAMBLE = "$2a$12$";

export async function login({ username, password }: TLoginForm) {
  try {
    const isPasswordValid = compareSync(
      password,
      BCRYPT_PREAMBLE + TRIPCONF_PASSWORD,
    );

    if (TRIPCONF_USERNAME !== username || isPasswordValid === false) {
      return { token: undefined, error: "Invalid username or password" };
    }

    const token = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(`${DAYS_TO_EXPIRE_TOKEN}d`)
      .sign(secret);

    return { token, error: undefined };
  } catch (error) {
    return {
      token: undefined,
      error: (error as Error).message ?? DEFAULT_ERROR_MESSAGE,
    };
  }
}
