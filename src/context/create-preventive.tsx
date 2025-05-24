"use client";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { createContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { schema } from "@/app/(routes)/preventive/create/schema";

interface Context {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  form: UseFormReturn<z.infer<typeof schema>>;
}

export const CreatePreventiveContext = createContext<null | Context>(null);

interface Props {
  children: React.ReactNode;
}

export function CreatePreventiveProvider({ children }: Readonly<Props>) {
  const [step, setStep] = useState(0);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      check_in: undefined,
      check_out: undefined,
      number_of_guests: undefined,
      double_rooms: "0",
      single_rooms: "0",
      free_quote: "0",
      description: "",
      number_of_vans: "0",
    },
    mode: "onChange",
  });

  const context: Context = {
    step,
    setStep,
    form,
  };

  return (
    <CreatePreventiveContext.Provider value={context}>
      <Form {...form}>
        <form>{children}</form>
      </Form>
    </CreatePreventiveContext.Provider>
  );
}
