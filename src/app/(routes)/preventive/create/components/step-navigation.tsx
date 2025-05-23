"use client";
import { Meals } from "./meals";
import { Fragment } from "react";
import { Confirm } from "./confirm";
import { Services } from "./services";
import { Button } from "@/components/ui/button";
import { ArrivalAndDeparture } from "./arrival-and-departure";
import { useCreatePreventive } from "@/hooks/use-create-preventive";

const STEPS = [
  ArrivalAndDeparture.stepTitle,
  Meals.stepTitle,
  Services.stepTitle,
  Confirm.stepTitle,
];

export function StepNavigation() {
  const { step, setStep } = useCreatePreventive();

  return (
    <section className="text-sm flex items-center">
      {STEPS.map((title, index) => {
        const isDisabled = index > step;
        const variant = index === step ? "default" : "outline";

        return (
          <Fragment key={title}>
            <Button
              type="button"
              variant={variant}
              disabled={isDisabled}
              onClick={() => setStep(index)}
              className="flex-1 text-center text-sm">
              <span className="hidden md:block">{title}</span>
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
