"use client";
import type { Service } from "@prisma/client";
// @components
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
// @hooks
import { usePreventiveForm } from "@/hooks/use-preventive-form";
// @libs
import { formatPrice } from "@/lib/utils";

interface Props {
  service: Service;
}

export function SwitchService({ service }: Readonly<Props>) {
  const { form, services, setServices } = usePreventiveForm();

  const numberOfGuests = form.getValues("numberOfGuests");

  let vans = 1;

  if (numberOfGuests > 7) {
    vans = Math.ceil(numberOfGuests / 7);
  }

  const isActive = services.some((item) => item.id === service.id);

  const updateService = (value: boolean) => {
    setServices((prev) => {
      if (value) {
        return [...prev, service];
      } else {
        return prev.filter((item) => item.id !== service.id);
      }
    });
  };

  const { costPerPerson, groupCost, vanCost } = service;

  const calculateCostForService = () => {
    return costPerPerson * numberOfGuests + groupCost + vanCost * vans;
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Switch
          id={service.id}
          name={service.id}
          checked={isActive}
          onCheckedChange={updateService}
        />
        <Label htmlFor={service.id} className="cursor-pointer">
          {service.name} {service.description && <> - {service.description}</>}
        </Label>
      </div>
      <p>
        {formatPrice(calculateCostForService())}
        <br />
        {service.isRequiredVan === true && (
          <span className="text-primary">
            Required {vans} {vans > 1 ? "vans" : "van"}
          </span>
        )}
      </p>
    </div>
  );
}
