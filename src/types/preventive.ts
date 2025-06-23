import { z } from "zod";
import type { Service } from "@prisma/client";
import type { UseFormReturn } from "react-hook-form";
// @libs
import { PreventiveForm } from "@/lib/schemas";
// @types
import type { TUseState } from ".";
import type { IMeal } from "./meal";

export type TPreventiveForm = z.infer<typeof PreventiveForm>;

export interface IPreventiveFormContext {
  step: number;
  setStep: TUseState<number>;
  isPending: boolean;
  form: UseFormReturn<TPreventiveForm, unknown, undefined>;
  meals: Array<IMeal>;
  setMeals: TUseState<Array<IMeal>>;
  services: Array<Service>;
  setServices: TUseState<Array<Service>>;
}

export interface ICreatePreventive {
  form: TPreventiveForm;
  meals: Array<IMeal>;
  services: Array<Service>;
}
