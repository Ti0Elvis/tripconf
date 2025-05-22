import { z } from "zod";

export const schema = z.object({
  username: z.string().min(1, { message: "The username cannot be empty" }),
  password: z.string().min(1, { message: "The password cannot be empty" }),
});
