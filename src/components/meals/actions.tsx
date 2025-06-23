"use client";
import { useForm } from "react-hook-form";
import type { Meal } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
// @actions
import { updateMeal } from "@/app/meals/actions";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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

interface Props {
  meal: Meal;
}

export function MealActions({ meal }: Readonly<Props>) {
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDropdownMenu, setOpenDropdownMenu] = useState(false);

  const router = useRouter();
  const { dismiss, toast } = useToast();

  const form = useForm<TMealForm>({
    resolver: zodResolver(MealForm),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({ ...meal, cost: String(meal.cost) });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openUpdateDialog]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-meal"],
    mutationFn: async (values: TMealForm) => {
      const { error } = await updateMeal(meal.id, { ...values });

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

      setOpenUpdateDialog(false);

      toast({
        title: "Meal updated successfully",
      });
    },
  });

  const { name, dayType, mealType, description, cost } = meal;

  return (
    <DropdownMenu open={openDropdownMenu} onOpenChange={setOpenDropdownMenu}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
          <Button
            size="sm"
            variant="outline"
            className="w-full h-8 rounded-sm border-none justify-start px-2"
            onClick={() => {
              dismiss();
              setOpenViewDialog(true);
            }}>
            View
          </Button>
          <DialogContent>
            <DialogTitle className="font-bold">Meal details</DialogTitle>
            <DialogDescription className="hidden" />
            <section className="space-y-4 italic">
              <div>
                <h2 className="font-bold">Name</h2>
                <p className="text-sm">{name}</p>
              </div>
              <hr />
              <div>
                <h2 className="font-bold">Day type</h2>
                <p className="text-sm">
                  {dayType === "first_day"
                    ? "First day"
                    : dayType === "last_day"
                    ? "Last day"
                    : "Default day"}
                </p>
              </div>
              <hr />
              <div>
                <h2 className="font-bold">Meal type</h2>
                <p className="text-sm">{mealType}</p>
              </div>
              <hr />
              {!!description === true && (
                <>
                  <div>
                    <h2 className="font-bold">Description</h2>
                    <p className="text-sm">{description}</p>
                  </div>
                  <hr />
                </>
              )}
              <div>
                <h2 className="font-bold">Cost</h2>
                <p className="text-sm">{formatPrice(cost ?? 0)}</p>
              </div>
            </section>
          </DialogContent>
        </Dialog>
        <DropdownMenuSeparator />
        <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
          <Button
            size="sm"
            variant="outline"
            className="w-full h-8 rounded-sm border-none justify-start px-2"
            onClick={() => {
              dismiss();
              setOpenUpdateDialog(true);
            }}>
            Update
          </Button>
          <DialogContent>
            <DialogTitle className="font-bold">Update meal</DialogTitle>
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
                          <SelectItem value="default_day">
                            Default day
                          </SelectItem>
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
                      <FormItem className="flex-grow">
                        <FormLabel>Cost</FormLabel>
                        <FormControl>
                          <Input
                            maxLength={5}
                            autoComplete="off"
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
                            className="resize-none"
                            placeholder="Insert a description for this meal"
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
