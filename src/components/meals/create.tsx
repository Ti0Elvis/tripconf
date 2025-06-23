"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
// @actions
import { createMeal } from "@/app/meals/actions";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
// @hooks
import { useToast } from "@/hooks/use-toast";
// @libs
import { MealForm } from "@/lib/schemas";
import { delay, formatPrice } from "@/lib/utils";
// @types
import type { TMealForm } from "@/types/meal";

export function CreateMeal() {
  const [openDialog, setOpenDialog] = useState(false);

  const router = useRouter();
  const { dismiss, toast } = useToast();

  const form = useForm<TMealForm>({
    resolver: zodResolver(MealForm),
    defaultValues: {
      cost: "",
      name: "",
      description: "",
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
    mutationKey: ["create-meal"],
    mutationFn: async (values: TMealForm) => {
      const { error } = await createMeal(values);

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
        title: "Meal created successfully",
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
        Create a meal
      </Button>
      <DialogContent>
        <DialogTitle className="font-bold">Meal form</DialogTitle>
        <DialogDescription className="hidden" />
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
              name="dayType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the day type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="first_day">First day</SelectItem>
                      <SelectItem value="default_day">Default day</SelectItem>
                      <SelectItem value="last_day">Last day</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="mealType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meal type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the meal type" />
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
                        autoComplete="off"
                        maxLength={5}
                        placeholder={`${formatPrice(0)}`}
                        {...field}
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
