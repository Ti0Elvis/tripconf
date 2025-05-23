"use client";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { useCreatePreventive } from "@/hooks/use-create-preventive";

export function ArrivalAndDeparture() {
  const { next } = useCreatePreventive();

  return (
    <Fragment>
      Arrival and Departure
      <div className="w-full flex flex-col gap-2 justify-end md:flex-row">
        <Button type="button" className="w-full md:w-auto" onClick={next}>
          Next
        </Button>
      </div>
    </Fragment>
  );
}

ArrivalAndDeparture.stepTitle = "Arrival and Departure";
