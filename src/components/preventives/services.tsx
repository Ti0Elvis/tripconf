"use client";
import { useQuery } from "@tanstack/react-query";
// @actions
import { getServicesCategories } from "@/app/services-categories/actions";
// @components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Card } from "../ui/card";
import { Spinner } from "../spinner";
import { Button } from "../ui/button";
import { SwitchService } from "./switch-service";
// @hooks
import { usePreventiveForm } from "@/hooks/use-preventive-form";
// @libs
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";

export function Services() {
  const { nextStep, prevStep, services } = usePreventiveForm();

  const { data, error, isLoading } = useQuery({
    queryKey: ["get-services-categories"],
    queryFn: async () => await getServicesCategories(),
  });

  if (!!error === true) {
    throw new Error(error?.message ?? DEFAULT_ERROR_MESSAGE);
  }

  const defaultAccordionValues = services.map((item) => item.categoryId);

  return (
    <>
      {data?.length === 0 && (
        <Card className="w-full p-6 bg-background">
          There are no services to show
        </Card>
      )}
      {!!data === true && data.length > 0 && (
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={defaultAccordionValues}>
          {data.map((item) => {
            return (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.name}</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {item.services.length === 0 && (
                    <p>There are no services available for this category</p>
                  )}
                  {item.services.length > 0 &&
                    item.services.map((_item) => {
                      return <SwitchService key={_item.id} service={_item} />;
                    })}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
      {isLoading === true && (
        <Spinner className="w-full flex flex-col gap-2 items-center justify-center" />
      )}
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
