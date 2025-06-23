import { z } from "zod";
// @libs
import { ServiceCategoryForm } from "@/lib/schemas";

export type TServiceCategoryForm = z.infer<typeof ServiceCategoryForm>;
