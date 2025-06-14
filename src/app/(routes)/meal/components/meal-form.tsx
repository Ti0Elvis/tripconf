"use client";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
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
import { formatPrice } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";

export const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Required" })
    .transform((item) => item.trim()),
  day: z.enum(["first", "default", "last"]),
  type: z.enum(["lunch", "dinner"]),
  cost: z.string().optional(), // 'cost' is handled as a string in the form, but represents a numeric value
  description: z.string().optional(),
});

export function MealForm() {
  const [dialog, setDialog] = useState(false);

  const { refresh } = useRouter();
  const { dismiss, toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      cost: "",
      name: "",
      description: "",
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
      <DialogTrigger asChild>
        <Button className="flex-grow">Create a meal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-bold">Meal form</DialogTitle>
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
            <FormField
              name="cost"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={5}
                        autoComplete="off"
                        placeholder={`${formatPrice(0)}`}
                        onChange={(item) => {
                          const value = item.target.value;
                          const lastChar = value.slice(-1);

                          if (lastChar === " ") {
                            return;
                          }

                          if (isNaN(Number(lastChar)) === false) {
                            form.setValue("cost", value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <hr />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Insert a description for this meal"
                        className="resize-none"
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
