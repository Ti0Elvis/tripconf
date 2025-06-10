import { useContext } from "react";
import { CreatePreventiveContext } from "@/context/create-preventive";

export function useCreatePreventive() {
  const context = useContext(CreatePreventiveContext)!;

  const next = () => {
    if (context.step < 3) {
      context.setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const previous = () => {
    if (context.step > 0) {
      context.setStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const reset = () => {
    context.form.reset();
  };

  return { next, previous, reset, ...context, ...context.form.watch() };
}
