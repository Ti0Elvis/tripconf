"use client";
import { useState } from "react";
import type { DayType } from "@prisma/client";
// @components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DataPicker } from "./data-picker";
import { ItemSelector } from "./item-selector";
import { addDays, differenceInDays, format } from "date-fns";
// @hooks
import { useToast } from "@/hooks/use-toast";
import { usePreventiveForm } from "@/hooks/use-preventive-form";
// @libs
import {
  MAX_DOUBLE_ROOMS,
  MAX_NUMBER_OF_GUESTS,
  MAX_SINGLE_ROOMS,
  MIN_NUMBER_OF_GUESTS,
} from "@/lib/constants";
// @types
import type { IMeal } from "@/types/meal";

export function ArrivalAndDeparture() {
  const { dismiss, toast } = useToast();
  const { nextStep, form, ...context } = usePreventiveForm();

  const { checkIn, checkOut, numberOfGuests, doubleRooms, singleRooms } =
    form.watch();

  const [prevDates, setPrevDates] = useState({
    checkIn: checkIn ?? new Date(),
    checkOut: checkOut ?? new Date(),
  });

  const isSelectedNumberOfGuests = () => {
    if (!!numberOfGuests === false) {
      toast({
        title: "Please select the number of guests",
        variant: "destructive",
      });

      return false;
    }

    return true;
  };

  const validateAndNext = async () => {
    dismiss();
    const isValidForm = await form.trigger();

    if (isValidForm === true) {
      const isDifferentCheckIn = checkIn !== prevDates.checkIn;
      const isDifferentCheckOut = checkOut !== prevDates.checkOut;

      const isDifferentDates = isDifferentCheckIn || isDifferentCheckOut;

      if (context.meals.length === 0 || isDifferentDates === true) {
        context.setMeals([]);
        context.setServices([]);

        const nights = differenceInDays(checkOut, checkIn);

        Array.from({ length: nights }, (_, i) => i).forEach((item, index) => {
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

          const meal: IMeal = {
            date,
            dayType,
            lunch: null,
            dinner: null,
          };

          context.setMeals((prev) => [...prev, meal]);
        });
      }

      setPrevDates({
        checkIn,
        checkOut,
      });

      nextStep();
    }
  };

  return (
    <>
      <FormField
        name="name"
        control={form.control}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Preventive&#39;s Name</FormLabel>
              <FormControl>
                <Input
                  autoComplete="true"
                  placeholder="Insert the name for the preventive"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <div className="w-full flex flex-col gap-4 md:flex-row">
        <FormField
          name="checkIn"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col">
                <FormLabel>Check in</FormLabel>
                <DataPicker
                  mode="single"
                  initialFocus
                  triggerText={
                    checkIn ? format(checkIn, "PPP") : "Select a date"
                  }
                  selected={checkIn}
                  initialDate={checkIn}
                  onSelect={(item) => {
                    field.onChange(item);
                    form.resetField("checkOut");
                  }}
                  disabled={(item) => {
                    return item < addDays(new Date(), -1);
                  }}
                />
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name="checkOut"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col">
                <FormLabel>Check out</FormLabel>
                <DataPicker
                  mode="single"
                  initialFocus
                  triggerText={
                    checkOut ? format(checkOut, "PPP") : "Select a date"
                  }
                  selected={checkOut}
                  initialDate={checkOut ? checkOut : checkIn}
                  onSelect={(item) => {
                    field.onChange(item);
                  }}
                  disabled={(item) => {
                    if (!!checkIn === true) {
                      return item < checkIn;
                    } else {
                      const yesterday = addDays(new Date(), -1);

                      return item < yesterday;
                    }
                  }}
                />
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
      <FormField
        name="numberOfGuests"
        control={form.control}
        render={() => {
          return (
            <FormItem>
              <FormLabel
                asLabel={false}
                textAsNotLabel="Select the number of guests"
              />
              <FormControl>
                <ItemSelector
                  valueSelected={numberOfGuests}
                  array={Array.from(
                    { length: MAX_NUMBER_OF_GUESTS - MIN_NUMBER_OF_GUESTS + 1 },
                    (_, i) => i + 2,
                  )}
                  onClick={(item) => {
                    dismiss();

                    form.clearErrors([
                      "numberOfGuests",
                      "doubleRooms",
                      "singleRooms",
                    ]);

                    form.setValue("freeQuote", 0);
                    form.setValue("numberOfGuests", item);
                    form.setValue("singleRooms", item % 2);
                    form.setValue("doubleRooms", Math.floor(item / 2));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <Card className="w-full p-3 text-sm">
        Please note: The Il Tesoro property has a total of 16 rooms. Each room
        has the option to be either single or double occupancy. Each room has a
        private ensuite bathroom. There are a total of 10 rooms in our main site
        villas, and 6 rooms in our additional villa Casa di Giovanni. Located
        next to our natural waterfall pool, Casa di Giovanni is a 10 minute walk
        from the 3 main site villas and the restaurant/event space building.
      </Card>
      <FormField
        name="doubleRooms"
        control={form.control}
        render={() => {
          return (
            <FormItem>
              <FormLabel
                asLabel={false}
                textAsNotLabel="Select the number of double rooms"
              />
              <FormControl>
                <ItemSelector
                  valueSelected={doubleRooms}
                  array={Array.from(
                    { length: MAX_DOUBLE_ROOMS + 1 },
                    (_, i) => i,
                  )}
                  onClick={(item) => {
                    if (isSelectedNumberOfGuests() === true) {
                      dismiss();

                      if (item * 2 > numberOfGuests) {
                        toast({
                          title:
                            "The number of double rooms is major than the number of guests",
                          variant: "destructive",
                        });

                        return;
                      }

                      let i = 0;
                      while (i < numberOfGuests - item * 2) {
                        i++;
                      }

                      if (i > MAX_SINGLE_ROOMS) {
                        toast({
                          title: "There are not much single rooms",
                          variant: "destructive",
                        });

                        return;
                      }

                      form.setValue("doubleRooms", item);
                      form.setValue("singleRooms", i);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        name="singleRooms"
        control={form.control}
        render={() => {
          return (
            <FormItem>
              <FormLabel
                asLabel={false}
                textAsNotLabel="Select the number of single rooms"
              />
              <FormControl>
                <ItemSelector
                  valueSelected={singleRooms}
                  array={Array.from(
                    { length: MAX_SINGLE_ROOMS + 1 },
                    (_, i) => i,
                  )}
                  onClick={(item) => {
                    if (isSelectedNumberOfGuests() === true) {
                      dismiss();

                      if (item > numberOfGuests) {
                        toast({
                          title:
                            "The number of single rooms is major than the number of guests",
                          variant: "destructive",
                        });

                        return;
                      }
                      let i = 0;
                      while (i * 2 < numberOfGuests - item) {
                        i++;
                      }

                      form.setValue("doubleRooms", i);
                      form.setValue("singleRooms", item);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <div className="w-full flex flex-col gap-4 justify-end md:flex-row">
        <Button
          type="button"
          className="w-full md:w-auto"
          onClick={validateAndNext}>
          Next
        </Button>
      </div>
    </>
  );
}
