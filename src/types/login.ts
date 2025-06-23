import { z } from "zod";
// @libs
import { LoginForm } from "@/lib/schemas";

export type TLoginForm = z.infer<typeof LoginForm>;
