"use client";
import { Fragment } from "react";
import { SelectMeal } from "./select-meal";
import { Card } from "@/components/ui/card";
import { getDate, getDay } from "../lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { differenceInDays, format, isEqual } from "date-fns";
import { groupMealsByDay } from "@/app/(routes)/meal/actions";
import { useCreatePreventive } from "@/hooks/use-create-preventive";
import { DEFAULT_DATE_FORMATTER, DEFAULT_ERROR_MESSAGE } from "@/lib/constants";

export function Meals() {
  const { next, previous, check_in, check_out, meals } = useCreatePreventive();

  const nights = differenceInDays(check_out, check_in);

  const { data, error, isLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: async () => await groupMealsByDay(),
  });

  if (error !== null) {
    throw new Error(error?.message ?? DEFAULT_ERROR_MESSAGE);
  }

  return (
    <Fragment>
      <p className="font-bold">Number of nights {nights}</p>
      {nights === 0 && (
        <Card className="w-full p-4 bg-background">
          The check in and check out dates are the same, for this reason meal
          selection is disabled.
        </Card>
      )}
      {nights > 0 && isLoading === true && (
        <span className="flex items-center gap-2">
          <LoaderCircleIcon className="w-4 h-4 animate-spin" />
          <p>Loading...</p>
        </span>
      )}
      {data !== undefined && nights > 0 && (
        <Fragment>
          {Array.from({ length: nights }, (_, i) => i).map((e, index) => {
            const day = getDay(index, nights);
            const date = getDate(day, check_in, check_out, index);

            const dailyMeals = meals.find((e) => {
              return isEqual(e.date, date);
            });

            const { lunch, dinner } = {
              lunch: dailyMeals?.lunch ?? null,
              dinner: dailyMeals?.dinner ?? null,
            };

            return (
              <Card key={e} className="p-4 gap-4 bg-background">
                <p className="text-sm">
                  Day {index + 1} ({format(date, DEFAULT_DATE_FORMATTER)})
                </p>
                <div className="flex flex-col gap-4 md:flex-row">
                  <SelectMeal
                    day={day}
                    date={date}
                    type="lunch"
                    defaultValue={lunch}
                    data={data[day]["lunches"]}
                  />
                  <SelectMeal
                    day={day}
                    date={date}
                    type="dinner"
                    defaultValue={dinner}
                    data={data[day]["dinners"]}
                  />
                </div>
              </Card>
            );
          })}
        </Fragment>
      )}
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
