import { z } from "zod";

export const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Required" })
    .transform((item) => item.trim()),
  check_in: z.date(),
  check_out: z.date(),
  number_of_guests: z.string(),
  double_rooms: z.string(),
  single_rooms: z.string(),
  free_quote: z.string().optional(),
  description: z.string().optional(),
  number_of_vans: z.string().optional(),
});
