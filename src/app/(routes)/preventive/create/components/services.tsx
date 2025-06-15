"use client";
import { Fragment } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SelectService } from "./select-service";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";
import { useCreatePreventive } from "@/hooks/use-create-preventive";
import { findAllServicesCategories } from "@/app/(routes)/service-category/actions";

export function Services() {
  const { next, previous, services } = useCreatePreventive();

  const { data, error, isLoading } = useQuery({
    queryKey: ["find-all-service-categories"],
    queryFn: async () => await findAllServicesCategories(),
  });

  if (error !== null) {
    throw new Error(error?.message ?? DEFAULT_ERROR_MESSAGE);
  }

  const defaultValues = services.map((e) => String(e.categoryId));

  return (
    <Fragment>
      {data !== undefined && data.length === 0 && (
        <Card className="w-full p-6 bg-background">
          There are no services to show
        </Card>
      )}
      {data !== undefined && data.length > 0 && (
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={defaultValues}>
          {data.map((e) => {
            return (
              <AccordionItem key={e.id} value={String(e.id)}>
                <AccordionTrigger>{e.name}</AccordionTrigger>
                <AccordionContent>
                  {e.services.length === 0 && (
                    <p>There are no services available for this category</p>
                  )}
                  {e.services.length > 0 &&
                    e.services.map((_e) => {
                      return <SelectService key={_e.id} service={_e} />;
                    })}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
      {isLoading === true && (
        <span className="flex items-center gap-2">
          <LoaderCircleIcon className="w-4 h-4 animate-spin" />
          <p>Loading...</p>
        </span>
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

Services.stepTitle = "Services";
