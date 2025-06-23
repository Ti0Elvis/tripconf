"use client";
import { saveAs } from "file-saver";
import { useForm } from "react-hook-form";
import type { Service } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useId, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
// @actions
import { getPreventive } from "@/app/preventives/[id]/actions";
import { createPDF, createPreventive } from "@/app/preventives/create/actions";
// @components
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Steps } from "@/components/preventives/steps";
// @hooks
import { useToast } from "@/hooks/use-toast";
// @libs
import { delay } from "@/lib/utils";
import { PreventiveForm } from "@/lib/schemas";
import { DEFAULT_NAME_PREVENTIVE_PDF } from "@/lib/constants";
// @types
import type {
  TPreventiveForm,
  IPreventiveFormContext,
} from "@/types/preventive";
import type { IMeal } from "@/types/meal";
import { checkAndSetMeals } from "@/app/meals/actions";
import { checkAndSetServices } from "@/app/services/actions";

export const PreventiveFormContext =
  createContext<IPreventiveFormContext | null>(null);

interface Props {
  children: React.ReactNode;
}

export function PreventiveFormProvider({ children }: Readonly<Props>) {
  const [step, setStep] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const id = useId(); // Unique ID to refetch data on each render
  const { toast } = useToast();
  const ID = useSearchParams().get("id"); // This make reference to the ID that we're going to duplicate

  const [meals, setMeals] = useState<Array<IMeal>>([]);
  const [services, setServices] = useState<Array<Service>>([]);

  const form = useForm<TPreventiveForm>({
    resolver: zodResolver(PreventiveForm),
    defaultValues: {
      name: "",
      doubleRooms: 0,
      singleRooms: 0,
      freeQuote: 0,
      description: "",
      numberOfVans: 0,
    },
    mode: "onChange",
  });

  const reset = () => {
    setMeals([]);
    setServices([]);
    form.reset({
      name: "",
      doubleRooms: 0,
      singleRooms: 0,
      freeQuote: 0,
      description: "",
      numberOfVans: 0,
    });
    setStep(0);
    setOpenDialog(false);
    window.scrollTo(0, 0);
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-preventive"],
    mutationFn: async (values: TPreventiveForm) => {
      try {
        const { error } = await createPreventive({
          form: values,
          meals,
          services,
        });

        if (error !== undefined) {
          throw new Error(error.message);
        }
      } catch (error) {
        throw new Error((error as Error).message);
      }

      try {
        const { buffer, error } = await createPDF({
          form: values,
          meals,
          services,
        });

        if (error !== undefined) {
          throw new Error(error.message);
        }

        if (buffer !== undefined) {
          const blob = new Blob([buffer], { type: "application/pdf" });

          saveAs(blob, `${DEFAULT_NAME_PREVENTIVE_PDF}.pdf`);
        }
      } catch (error) {
        throw new Error((error as Error).message);
      }

      await delay(500);
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      setOpenDialog(true);
    },
  });

  const { error, isFetched } = useQuery({
    queryKey: ["get-preventive-by-id", id],
    queryFn: async () => {
      if (ID !== null) {
        const { preventive, error } = await getPreventive(ID!);

        if (error !== undefined) {
          throw new Error(error);
        }

        try {
          const { newMeals, error } = await checkAndSetMeals(preventive.meals);

          if (error !== undefined) {
            throw new Error(error);
          }

          setMeals(newMeals);
        } catch (error) {
          throw new Error((error as Error).message);
        }

        try {
          const { newServices, error } = await checkAndSetServices(
            preventive.services,
          );

          if (error !== undefined) {
            throw new Error(error);
          }

          setServices(newServices);
        } catch (error) {
          throw new Error((error as Error).message);
        }

        form.reset({
          name: preventive.name,
          checkIn: preventive.checkIn,
          checkOut: preventive.checkOut,
          numberOfGuests: preventive.numberOfGuests,
          freeQuote: preventive.freeQuote,
          doubleRooms: preventive.doubleRooms,
          singleRooms: preventive.singleRooms,
          description: preventive.description,
          numberOfVans: preventive.numberOfVans,
        });
      }

      return null;
    },
    retry: false,
    staleTime: Infinity,
  });

  if (error !== null) {
    throw new Error(error.message);
  }

  const props: IPreventiveFormContext = {
    step,
    setStep,
    isPending,
    form,
    meals,
    setMeals,
    services,
    setServices,
  };

  return (
    <PreventiveFormContext.Provider value={props}>
      <Steps />
      {isFetched === false && (
        <Spinner className="w-full mt-12 flex flex-col gap-2 items-center justify-center" />
      )}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutate(values))}>
            {isFetched === true && children}
          </form>
        </Form>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Preventive Created Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              The preventive was created successfully. You can now create
              another preventive or go to the preventives page
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <Button onClick={reset}>Start Over</Button>
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = "/preventives";
              }}>
              Go to Preventives
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PreventiveFormContext.Provider>
  );
}
