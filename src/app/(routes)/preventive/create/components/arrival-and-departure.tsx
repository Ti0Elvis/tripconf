"use client";
import {
  MAX_DOUBLE_ROOMS,
  MAX_NUMBER_OF_GUESTS,
  MAX_SINGLE_ROOMS,
  MIN_NUMBER_OF_GUESTS,
} from "@/lib/constants";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Fragment, useState } from "react";
import { addDays, format } from "date-fns";
import { Card } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useCreatePreventive } from "@/hooks/use-create-preventive";

export function ArrivalAndDeparture() {
  const { next, form, check_in, check_out, setMeals } = useCreatePreventive();

  const [dates, setDates] = useState({
    check_in: check_in ?? new Date(),
    check_out: check_out ?? new Date(),
  });

  const validateAndNext = async () => {
    const isValid = await form.trigger();

    if (isValid === true) {
      // Reset meals to ensure consistency when dates change
      if (check_in !== dates.check_in || check_out !== dates.check_out) {
        setMeals([]);
      }

      setDates({ check_in, check_out });
      next();
    }
  };

  return (
    <Fragment>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Preventive&#39;s name</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="Insert the name of the preventive"
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
          control={form.control}
          name="check_in"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Check in</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-between md:w-72">
                        {check_in
                          ? format(check_in, "PPP")
                          : "Select the date for the check-in"}
                        <CalendarIcon />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto">
                    <Calendar
                      mode="single"
                      initialFocus
                      selected={form.watch("check_in")}
                      onSelect={(e) => {
                        field.onChange(e);
                        form.resetField("check_out");
                      }}
                      disabled={(e) => e < addDays(new Date(), -1)}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="check_out"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Check out</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-between md:w-72">
                        {check_out
                          ? format(check_out, "PPP")
                          : "Select the date for the check-out"}
                        <CalendarIcon />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto">
                    <Calendar
                      mode="single"
                      initialFocus
                      selected={form.watch("check_out")}
                      onSelect={(e) => field.onChange(e)}
                      disabled={(e) => {
                        const check_in = form.watch("check_in");

                        if (check_in !== undefined) {
                          return e < check_in;
                        } else {
                          return e < addDays(new Date(), -1);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
      <FormField
        control={form.control}
        name="number_of_guests"
        render={() => (
          <section className="flex flex-col gap-2">
            <FormItem>
              <FormLabel>Number of guests</FormLabel>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  {
                    length: MAX_NUMBER_OF_GUESTS - MIN_NUMBER_OF_GUESTS + 1,
                  },
                  (_, i) => i + MIN_NUMBER_OF_GUESTS
                ).map((e) => (
                  <span
                    key={e}
                    onClick={() => {
                      form.setValue("number_of_guests", String(e));
                      form.clearErrors("number_of_guests");

                      form.setValue("number_of_guests", String(e));
                      form.setValue("single_rooms", String(e % 2));
                      form.setValue("double_rooms", String(Math.floor(e / 2)));
                    }}
                    className={cn(
                      "min-w-8 min-h-8 px-2 flex justify-center items-center text-sm font-extrabold cursor-pointer border border-primary rounded-full",
                      form.watch("number_of_guests") === String(e)
                        ? "bg-primary text-white"
                        : "hover:bg-primary/40"
                    )}>
                    {e}
                  </span>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          </section>
        )}
      />
      <Card className="w-full p-4 text-sm">
        Please note: The Il Tesoro property has a total of 16 rooms. Each room
        has the option to be either single or double occupancy. Each room has a
        private ensuite bathroom. There are a total of 10 rooms in our main site
        villas, and 6 rooms in our additional villa Casa di Giovanni. Located
        next to our natural waterfall pool, Casa di Giovanni is a 10 minute walk
        from the 3 main site villas and the restaurant/event space building.
      </Card>
      <FormField
        control={form.control}
        name="double_rooms"
        render={() => (
          <section className="flex flex-col gap-2">
            <FormItem>
              <FormLabel>Double rooms</FormLabel>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  {
                    length: MAX_DOUBLE_ROOMS + 1,
                  },
                  (_, i) => i
                ).map((e) => (
                  <span
                    key={e}
                    onClick={() => form.setValue("double_rooms", String(e))}
                    className={cn(
                      "min-w-8 min-h-8 px-2 flex justify-center items-center text-sm font-extrabold cursor-pointer border border-primary rounded-full",
                      form.watch("double_rooms") === String(e)
                        ? "bg-primary text-white"
                        : "hover:bg-primary/40"
                    )}>
                    {e}
                  </span>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          </section>
        )}
      />
      <FormField
        control={form.control}
        name="single_rooms"
        render={() => (
          <section className="flex flex-col gap-2">
            <FormItem>
              <FormLabel>Single rooms</FormLabel>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  {
                    length: MAX_SINGLE_ROOMS + 1,
                  },
                  (_, i) => i
                ).map((e) => (
                  <span
                    key={e}
                    onClick={() => form.setValue("single_rooms", String(e))}
                    className={cn(
                      "min-w-8 min-h-8 px-2 flex justify-center items-center text-sm font-extrabold cursor-pointer border border-primary rounded-full",
                      form.watch("single_rooms") === String(e)
                        ? "bg-primary text-white"
                        : "hover:bg-primary/40"
                    )}>
                    {e}
                  </span>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          </section>
        )}
      />
      <div className="w-full flex flex-col gap-2 justify-end md:flex-row">
        <Button
          type="button"
          className="w-full md:w-auto"
          onClick={validateAndNext}>
          Next
        </Button>
      </div>
    </Fragment>
  );
}

ArrivalAndDeparture.stepTitle = "Arrival and Departure";
