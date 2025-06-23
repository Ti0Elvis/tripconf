"use client";
import { differenceInDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
// @actions
import { getMealsByGroup } from "@/app/meals/actions";
// @components
import { Card } from "../ui/card";
import { Spinner } from "../spinner";
import { Button } from "../ui/button";
import { RenderSelectsMeals } from "./render-selects-meals";
// @hooks
import { usePreventiveForm } from "@/hooks/use-preventive-form";
// @libs
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";

export function Meals() {
  const { nextStep, prevStep, form } = usePreventiveForm();

  const { data, error, isLoading } = useQuery({
    queryKey: ["get-meals-by-group"],
    queryFn: async () => await getMealsByGroup(),
  });

  if (!!error === true) {
    throw new Error(error?.message ?? DEFAULT_ERROR_MESSAGE);
  }

  const { checkIn, checkOut } = form.getValues();

  const nights = differenceInDays(checkOut, checkIn);

  return (
    <>
      <p className="font-bold">Number of nights {nights}</p>
      {nights === 0 && (
        <Card className="w-full p-4 bg-background">
          Check-in and check-out dates are the same, so meal selection is
          disabled.
        </Card>
      )}
      {nights > 0 && isLoading === true && (
        <Spinner className="w-full flex flex-col gap-2 items-center justify-center" />
      )}
      {!!data === true && nights > 0 && <RenderSelectsMeals data={data} />}
      <div className="w-full flex flex-col gap-4 justify-end md:flex-row">
        <Button
          type="button"
          variant="outline"
          className="w-full md:w-auto"
          onClick={prevStep}>
          Previous
        </Button>
        <Button type="button" className="w-full md:w-auto" onClick={nextStep}>
          Next
        </Button>
      </div>
    </>
  );
}
