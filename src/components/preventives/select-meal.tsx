"use client";
import { Fragment, useState } from "react";
import { getTime, isEqual } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import type { MealType, Meal } from "@prisma/client";
// @components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
// @hooks
import { usePreventiveForm } from "@/hooks/use-preventive-form";
// @libs
import { formatPrice } from "@/lib/utils";

interface Props {
  date: Date;
  data: Array<Meal>;
  mealType: MealType;
  defaultValue: Meal | null;
}

export function SelectMeal(props: Readonly<Props>) {
  const [meal, setMeal] = useState<Meal | null>(props.defaultValue);

  const { meals, setMeals } = usePreventiveForm();

  const updateMeal = (value: Meal | null) => {
    setMeal(value);

    const mealObj = meals.find((item) => isEqual(item.date, props.date));

    if (!!mealObj === false) {
      return;
    }

    mealObj[props.mealType] = value;

    const filteredMeals = meals.filter(
      (item) => !isEqual(item.date, props.date),
    );

    setMeals(
      [...filteredMeals, mealObj].sort(
        (a, b) => getTime(a.date) - getTime(b.date),
      ),
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-between flex-1 text-left text-sm px-4 py-2 border rounded hover:bg-accent">
        {!!meal === true && `${meal.name} - ${formatPrice(meal.cost ?? 0)}`}
        {!!meal === false && `Select ${props.mealType}`}
        <ChevronDownIcon className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-72 overflow-y-auto">
        <DropdownMenuItem
          onClick={() => {
            updateMeal(null);
          }}>
          No
        </DropdownMenuItem>
        {props.data.length > 0 && <DropdownMenuSeparator />}
        {props.data.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <DropdownMenuItem
                className="flex gap-12 justify-between"
                onClick={() => updateMeal(item)}>
                <div>
                  {item.name}
                  <br />
                  {item.description && `(${item.description})`}
                </div>
                {formatPrice(item.cost ?? 0)}
              </DropdownMenuItem>
              {index !== props.data.length - 1 && <DropdownMenuSeparator />}
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
