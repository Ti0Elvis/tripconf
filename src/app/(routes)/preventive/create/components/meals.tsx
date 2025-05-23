"use client";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { useCreatePreventive } from "@/hooks/use-create-preventive";

export function Meals() {
  const { next, previous } = useCreatePreventive();

  return (
    <Fragment>
      Meals
      <div className="w-full flex flex-col gap-2 justify-end md:flex-row">
        <Button
          type="button"
          variant="outline"
          className="w-full md:w-auto"
          onClick={previous}>
          Previous
        </Button>
        <Button type="button" className="w-full md:w-auto" onClick={next}>
          Next
        </Button>
      </div>
    </Fragment>
  );
}

Meals.stepTitle = "Meals";
