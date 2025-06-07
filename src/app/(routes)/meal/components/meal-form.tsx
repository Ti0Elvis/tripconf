"use client";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { create } from "../actions";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

export const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Required" })
    .transform((item) => item.trim()),
  day: z.enum(["first", "default", "last"]),
  type: z.enum(["lunch", "dinner"]),
});

export function MealForm() {
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
    mutationKey: ["create-meal"],
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
        title: "Meal created successfully",
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
      <Button className="flex-grow" onClick={() => setDialog(true)}>
        Create a meal
      </Button>
      <DialogContent>
        <DialogTitle className="font-bold">Meal form</DialogTitle>
        <DialogDescription className="hidden" />
        <Form {...form}>
          <form className="mt-8 space-y-8" onSubmit={onSubmit}>
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
                        placeholder="Insert the name for the meal"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="day"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Day type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select the day type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="first">First </SelectItem>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="last">Last </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="type"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Meal type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select the day type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
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
