"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
// @actions
import { createServiceCategory } from "@/app/services-categories/actions";
// @components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// @hooks
import { useToast } from "@/hooks/use-toast";
// @libs
import { delay } from "@/lib/utils";
import { ServiceCategoryForm } from "@/lib/schemas";
// @types
import type { TServiceCategoryForm } from "@/types/service-category";

export function CreateServiceCategory() {
  const [openDialog, setOpenDialog] = useState(false);

  const router = useRouter();
  const { dismiss, toast } = useToast();

  const form = useForm<TServiceCategoryForm>({
    resolver: zodResolver(ServiceCategoryForm),
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (openDialog === false) {
      form.reset();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDialog]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-service-category"],
    mutationFn: async (values: TServiceCategoryForm) => {
      const { error } = await createServiceCategory(values);

      if (error !== undefined) {
        throw new Error(error);
      }
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      router.refresh();
      await delay(500);

      setOpenDialog(false);

      toast({
        title: "Service category created successfully",
      });
    },
  });

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <Button
        className="flex-grow"
        onClick={() => {
          dismiss();
          setOpenDialog(true);
        }}>
        Create a service category
      </Button>
      <DialogContent>
        <DialogTitle className="font-bold">Service category form</DialogTitle>
        <DialogDescription hidden />
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => mutate(values))}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Insert the name for the service category"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="w-full flex justify-end">
              <Button disabled={isPending}>
                {isPending ? "Loading..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
