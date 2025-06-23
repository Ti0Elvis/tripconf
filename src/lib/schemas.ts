import { z } from "zod";

export const LoginForm = z.object({
  username: z.string().min(1, { message: "The username cannot be empty" }),
  password: z.string().min(1, { message: "The password cannot be empty" }),
});

export const PreventiveForm = z.object({
  name: z
    .string()
    .min(1, { message: "The name of the preventive cannot be empty" })
    .transform((item) => item.trim()),
  checkIn: z.date({ required_error: "Please select the check-in" }),
  checkOut: z.date({ required_error: "Please select the check-out" }),
  numberOfGuests: z.number({
    required_error: "Please select the number of guests",
  }),
  doubleRooms: z.number(),
  singleRooms: z.number(),
  freeQuote: z.number().optional(),
  description: z.string().optional(),
  numberOfVans: z.number().optional(),
});

export const MealForm = z.object({
  name: z
    .string()
    .min(1, { message: "The name of the meal cannot be empty" })
    .transform((item) => item.trim()),
  dayType: z.enum(["first_day", "default_day", "last_day"]),
  mealType: z.enum(["lunch", "dinner"]),
  cost: z.string().optional(),
  description: z.string().optional(),
});

export const ServiceForm = z.object({
  name: z
    .string()
    .min(1, { message: "The name of the service cannot be empty" })
    .transform((item) => item.trim()),
  costPerPerson: z.string().optional(),
  groupCost: z.string().optional(),
  isRequiredVan: z.boolean().optional(),
  vanCost: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string(),
});

export const ServiceCategoryForm = z.object({
  name: z
    .string()
    .min(1, { message: "The name of the service-category cannot be empty" })
    .transform((item) => item.trim()),
});
