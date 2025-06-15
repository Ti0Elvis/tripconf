"use client";
import { format } from "date-fns";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
import { cn, formatPrice } from "@/lib/utils";
import { Summary } from "@/components/summary";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePreventive } from "@/hooks/use-create-preventive";
import { MAX_FREE_QUOTE, MAX_NUMBER_OF_VANS, TAX } from "@/lib/constants";

export function Confirm() {
  const { previous, form, meals, services } = useCreatePreventive();
  const { ...preventive } = form.watch();

  useEffect(() => {
    if (services.some((item) => item.isRequiredVan === true) === true) {
      const vans = Math.ceil(Number(preventive.number_of_guests) / 7);

      form.setValue("number_of_vans", String(vans));
    } else {
      form.setValue("number_of_vans", "0");
    }
  }, [services]);

  const onSubmit = form.handleSubmit((values) => {
    console.log(values);
  });

  return (
    <div className="space-y-4 italic">
      <Summary preventive={preventive} />
      <hr />
      <div>
        <h3 className="text-lg font-semibold">Meals</h3>
        {meals.length === 0 && <p>No meals were selected</p>}
        {meals.length > 0 && (
          <div className="space-y-4">
            {meals.map((e) => {
              const { lunch, dinner } = e;

              return (
                <article key={e.date.toString()}>
                  <p>Day: {format(e.date, "PPP")}</p>
                  <p>
                    Lunch: {lunch?.name ? lunch.name : "No selected"}{" "}
                    {lunch?.description && `(${lunch?.description})`}
                  </p>
                  <p>
                    Dinner: {dinner?.name ? dinner.name : "No selected"}{" "}
                    {dinner?.description && `(${dinner?.description})`}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </div>
      <hr />
      <div>
        <h3 className="text-lg font-semibold">Service</h3>
        {services.length === 0 && <p>No services were selected</p>}
        {services.length > 0 &&
          services.map((e) => {
            return (
              <article key={e.id}>
                <p>
                  • {e.name}
                  {e.isRequiredVan === true && <span> (Required van)</span>}
                </p>
              </article>
            );
          })}
      </div>
      <hr />
      <FormField
        control={form.control}
        name="free_quote"
        render={() => (
          <section className="flex flex-col gap-2">
            <FormItem>
              <FormLabel>Free quotes</FormLabel>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  {
                    length: MAX_FREE_QUOTE + 1,
                  },
                  (_, i) => i
                ).map((e) => (
                  <span
                    key={e}
                    onClick={() => form.setValue("free_quote", String(e))}
                    className={cn(
                      "min-w-8 min-h-8 px-2 flex justify-center items-center text-sm font-extrabold cursor-pointer border border-primary rounded-full",
                      form.watch("free_quote") === String(e)
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
      {services.some((e) => e.isRequiredVan === true) && (
        <FormField
          control={form.control}
          name="number_of_vans"
          render={() => (
            <section className="flex flex-col gap-2">
              <FormItem>
                <FormLabel>Vans</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    {
                      length: MAX_NUMBER_OF_VANS + 1,
                    },
                    (_, i) => i
                  ).map((e) => (
                    <span
                      key={e}
                      onClick={() => form.setValue("number_of_vans", String(e))}
                      className={cn(
                        "min-w-8 min-h-8 px-2 flex justify-center items-center text-sm font-extrabold cursor-pointer border border-primary rounded-full",
                        form.watch("number_of_vans") === String(e)
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
      <hr />
      <div>
        <h3 className="text-lg font-semibold">Preventive costs</h3>
        <div className="flex justify-between">
          <p>Total cost</p>
          <p>{formatPrice(0)}</p>
        </div>
        <div className="flex justify-between">
          <p>Total cost with il Tesoro Experiences services ({TAX}%):</p>
          <p>{formatPrice(0)}</p>
        </div>
        <div className="flex justify-between">
          <p>
            Total pay for guests (
            {eval(
              `${preventive.number_of_guests} - ${preventive.free_quote ?? 0}`
            )}
            ):
          </p>
          <p>{formatPrice(0)}</p>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2 justify-end md:flex-row">
        <Button
          type="button"
          variant="outline"
          className="w-full md:w-auto"
          onClick={previous}>
          Previous
        </Button>
        <Button type="button" className="w-full md:w-auto" onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}

Confirm.stepTitle = "Confirm";
