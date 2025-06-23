"use client";
import { useEffect } from "react";
// @components
import { Summary } from "./summary";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ItemSelector } from "./item-selector";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
// @hooks
import { useToast } from "@/hooks/use-toast";
import { usePreventiveForm } from "@/hooks/use-preventive-form";
// @libs
import { MAX_FREE_QUOTE, MAX_NUMBER_OF_VANS } from "@/lib/constants";

export function Confirm() {
  const { prevStep, isPending, form, meals, services } = usePreventiveForm();

  const { toast } = useToast();

  const values = form.getValues();

  const { numberOfGuests, freeQuote } = form.watch();

  useEffect(() => {
    if (services.some((item) => item.isRequiredVan === true) === true) {
      let vans = 1;

      if (values.numberOfGuests > 7) {
        vans = Math.ceil(values.numberOfGuests / 7);
      }

      form.setValue("numberOfVans", vans);
    } else {
      form.setValue("numberOfVans", 0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services]);

  return (
    <>
      <Summary preventive={{ ...values }} meals={meals} services={services} />
      <hr />
      <FormField
        name="freeQuote"
        control={form.control}
        render={() => {
          return (
            <FormItem>
              <FormLabel
                asLabel={false}
                textAsNotLabel="Select the number of free quote"
              />
              <FormControl>
                <ItemSelector
                  valueSelected={freeQuote ?? 0}
                  array={Array.from(
                    { length: MAX_FREE_QUOTE + 1 },
                    (_, i) => i,
                  )}
                  onClick={(item) => {
                    if (item >= numberOfGuests) {
                      toast({
                        title:
                          "The number of quote guests is equal or major than the number of guests",
                        variant: "destructive",
                      });
                      return;
                    }
                    form.setValue("freeQuote", item);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      {services.some((item) => item.isRequiredVan === true) && (
        <FormField
          name="numberOfVans"
          control={form.control}
          render={() => {
            return (
              <FormItem>
                <FormLabel
                  asLabel={false}
                  textAsNotLabel="Select the number of vans"
                />
                <FormControl>
                  <ItemSelector
                    valueSelected={values.numberOfVans ?? 0}
                    array={Array.from(
                      { length: MAX_NUMBER_OF_VANS + 1 },
                      (_, i) => i,
                    )}
                    onClick={(item) => form.setValue("numberOfVans", item)}
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />
      )}
      <FormField
        name="description"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Insert a note or and special request"
                className="resize-none"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="w-full flex flex-col gap-4 justify-end md:flex-row">
        <Button
          type="button"
          variant="outline"
          className="w-full md:w-auto"
          onClick={prevStep}
          disabled={isPending}>
          Previous
        </Button>
        <Button className="w-full md:w-auto" disabled={isPending}>
          {isPending ? "Loading..." : "Submit"}
        </Button>
      </div>
    </>
  );
}
