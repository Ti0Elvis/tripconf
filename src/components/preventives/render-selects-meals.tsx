"use client";
import type { DayType } from "@prisma/client";
import { addDays, differenceInDays, format, isEqual } from "date-fns";
// @components
import { Card } from "../ui/card";
import { SelectMeal } from "./select-meal";
// @hooks
import { usePreventiveForm } from "@/hooks/use-preventive-form";
// @libs
import { DEFAULT_DATE_FORMATTER } from "@/lib/constants";
// @types
import type { IGetMealsByGroup } from "@/types/meal";

interface Props {
  data: IGetMealsByGroup | undefined;
}

export function RenderSelectsMeals({ data }: Readonly<Props>) {
  const { form, meals } = usePreventiveForm();

  if (!!data === false) return null;

  const { checkIn, checkOut } = form.getValues();

  const nights = differenceInDays(checkOut, checkIn);

  return Array.from({ length: nights }, (_, i) => i).map((item, index) => {
    let date;
    let dayType: DayType;

    if (index === 0) {
      dayType = "first_day";
    } else if (index === nights - 1) {
      dayType = "last_day";
    } else {
      dayType = "default_day";
    }

    if (dayType === "first_day") {
      date = checkIn;
    } else if (dayType === "last_day") {
      date = addDays(checkOut, -1);
    } else {
      date = addDays(checkIn, index);
    }

    const searchMeal = meals.find((item) => {
      return isEqual(item.date, date);
    });

    const defaultValues = {
      lunch: searchMeal?.lunch ?? null,
      dinner: searchMeal?.dinner ?? null,
    };

    return (
      <Card key={item} className="p-4 space-y-4 bg-background">
        <p className="text-sm">
          Day {index + 1} ({format(date, DEFAULT_DATE_FORMATTER)})
        </p>
        <div className="flex flex-col gap-4 md:flex-row">
          <SelectMeal
            date={date}
            data={data[dayType]["lunches"]}
            mealType="lunch"
            defaultValue={defaultValues.lunch}
          />
          <SelectMeal
            date={date}
            data={data[dayType]["dinners"]}
            mealType="dinner"
            defaultValue={defaultValues.dinner}
          />
        </div>
      </Card>
    );
  });
}
