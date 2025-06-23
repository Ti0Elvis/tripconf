import { useContext } from "react";
// @context
import { PreventiveFormContext } from "@/context/preventive-form";

export function usePreventiveForm() {
  const context = useContext(PreventiveFormContext)!;

  const nextStep = () => {
    if (context.step < 3) {
      context.setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (context.step > 0) {
      context.setStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  return {
    nextStep,
    prevStep,
    ...context,
  };
}
