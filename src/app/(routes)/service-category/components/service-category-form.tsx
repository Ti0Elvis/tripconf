"use client";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { create } from "../actions";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

export const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Required" })
    .transform((item) => item.trim().toUpperCase()),
});

export function ServiceCategoryForm() {
  const [dialog, setDialog] = useState(false);

  const { refresh } = useRouter();
  const { dismiss, toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (dialog === false) {
      form.reset();
    }

    dismiss();
  }, [dialog]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-service-category"],
    mutationFn: async (values: z.infer<typeof schema>) => {
      const { error } = await create(values);

      if (error !== undefined) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      refresh();
      setDialog(false);
      toast({
        title: "Service category created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((values) => mutate(values));

  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
      <DialogTrigger asChild>
        <Button className="flex-grow">Create service category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-bold">Service category form</DialogTitle>
        <DialogDescription className="hidden" />
        <Form {...form}>
          <form className="space-y-4" onSubmit={onSubmit}>
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
