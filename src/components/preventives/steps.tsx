"use client";
import { Fragment } from "react";
// @components
import { Button } from "../ui/button";
// @hooks
import { usePreventiveForm } from "@/hooks/use-preventive-form";

const STEPS = ["Arrival and Departure", "Meals", "Service", "Confirm"];

export function Steps() {
  const { step, setStep, isPending } = usePreventiveForm();

  return (
    <section className="mt-4 text-sm flex items-center">
      {STEPS.map((item, index) => {
        const isDisabled = index > step || isPending;
        const variant = index === step ? "default" : "outline";

        return (
          <Fragment key={item}>
            <Button
              type="button"
              variant={variant}
              disabled={isDisabled}
              className="flex-1 text-center text-sm"
              onClick={() => setStep(index)}>
              <span className="hidden md:block">{item}</span>
              <span className="block md:hidden">{index + 1}</span>
            </Button>
            {index + 1 !== STEPS.length && (
              <div className="flex-1 h-px bg-zinc-300 dark:bg-gray-600" />
            )}
          </Fragment>
        );
      })}
    </section>
  );
}
