import { z } from "zod";
// @libs
import { ServiceForm } from "@/lib/schemas";

export type TServiceForm = z.infer<typeof ServiceForm>;
