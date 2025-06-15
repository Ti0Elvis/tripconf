"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPrice } from "@/lib/utils";
import { getTime, isEqual } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Day, Meal, Type } from "@prisma/client";
import { Fragment, useContext, useState } from "react";
import { CreatePreventiveContext } from "@/context/create-preventive";

interface Props {
  day: Day;
  data: Array<Meal>;
  date: Date;
  type: Type;
  defaultValue: Meal | null;
}

export function SelectMeal({ ...props }: Readonly<Props>) {
  const [meal, setMeal] = useState<Meal | null>(props.defaultValue);

  const { meals, setMeals } = useContext(CreatePreventiveContext)!;

  const updateMeals = (meal: Meal | null) => {
    setMeal(meal);

    let dailyMealsEntry = meals.find((item) => isEqual(item.date, props.date));

    if (dailyMealsEntry === undefined) {
      dailyMealsEntry = {
        day: props.day,
        date: props.date,
        lunch: meal?.type === "lunch" ? meal : null,
        dinner: meal?.type === "dinner" ? meal : null,
      };
    }

    dailyMealsEntry[props.type] = meal;

    setMeals(
      [
        ...meals.filter((item) => !isEqual(item.date, props.date)),
        dailyMealsEntry,
      ]
        .sort((a, b) => getTime(a.date) - getTime(b.date))
        .filter((e) => e.lunch !== null || e.dinner !== null)
    );
    return;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center justify-between flex-1 text-left text-sm px-4 py-2 border rounded hover:bg-accent">
        {meal !== null && `${meal.name} - ${formatPrice(meal.cost ?? 0)}`}
        {meal === null && "Select meal"}
        <ChevronDownIcon className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-72 overflow-y-auto">
        <DropdownMenuItem onClick={() => updateMeals(null)}>
          No
        </DropdownMenuItem>
        {props.data.length > 0 && <DropdownMenuSeparator />}
        {props.data.map((e, index) => {
          return (
            <Fragment key={e.id}>
              <DropdownMenuItem
                onClick={() => updateMeals(e)}
                className="flex gap-12 justify-between">
                <div>
                  {e.name}
                  <br />
                  {e.description && `(${e.description})`}
                </div>
                {formatPrice(e.cost ?? 0)}
              </DropdownMenuItem>
              {index !== props.data.length - 1 && <DropdownMenuSeparator />}
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
