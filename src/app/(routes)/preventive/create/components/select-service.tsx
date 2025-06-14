"use client";
import { Service } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCreatePreventive } from "@/hooks/use-create-preventive";

interface Props {
  service: Service;
}

export function SelectService({ service }: Readonly<Props>) {
  const [vans, setVans] = useState(0);
  const { services, setServices, number_of_guests } = useCreatePreventive();

  useEffect(() => {
    if (service.isRequiredVan === true) {
      setVans(Math.ceil(Number(number_of_guests) / 7));
    }
  }, []);

  const isActive = services.some((item) => item.id === service.id);

  const updateServices = (v: boolean) => {
    setServices((prev) => {
      if (v === true) {
        return [...prev, service];
      } else {
        return prev.filter((item) => item.id !== service.id);
      }
    });
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Switch
          checked={isActive}
          id={String(service.id)}
          name={String(service.id)}
          onCheckedChange={updateServices}
        />
        <Label htmlFor={String(service.id)}>
          {service.name} {service.description && <> - {service.description}</>}
        </Label>
      </div>
      <p>
        {formatPrice(0)}
        <br />
        {service.isRequiredVan === true && (
          <span className="text-primary">Required {vans} van/s</span>
        )}
      </p>
    </div>
  );
}
