"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
// @actions
import { createService } from "@/app/services/actions";
import { getServicesCategories } from "@/app/services-categories/actions";
// @components
import {
  Form,
  FormControl,
  FormDescription,
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
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
// @hooks
import { useToast } from "@/hooks/use-toast";
// @libs
import { ServiceForm } from "@/lib/schemas";
import { delay, formatPrice } from "@/lib/utils";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";
// @types
import type { TServiceForm } from "@/types/service";

export function CreateService() {
  const [openDialog, setOpenDialog] = useState(false);

  const router = useRouter();
  const { dismiss, toast } = useToast();

  const form = useForm<TServiceForm>({
    resolver: zodResolver(ServiceForm),
    defaultValues: {
      name: "",
      costPerPerson: "",
      groupCost: "",
      vanCost: "",
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
    mutationKey: ["create-service"],
    mutationFn: async (values: TServiceForm) => {
      const { error } = await createService(values);

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
        title: "Service created successfully",
      });
    },
  });

  const { data, error } = useQuery({
    queryKey: ["get-services-categories"],
    queryFn: async () => await getServicesCategories(),
  });

  if (!!error === true) {
    throw new Error(error.message ?? DEFAULT_ERROR_MESSAGE);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <Button
        className="flex-grow"
        onClick={() => {
          dismiss();
          setOpenDialog(true);
        }}>
        Create a service
      </Button>
      <DialogContent>
        <DialogTitle className="font-bold">Service form</DialogTitle>
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
                        placeholder="Insert the name for the service"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="costPerPerson"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Cost per person</FormLabel>
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
                            form.setValue("costPerPerson", value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="groupCost"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Group cost</FormLabel>
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
                            form.setValue("groupCost", value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="vanCost"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Van cost</FormLabel>
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
                            form.setValue("vanCost", value);
                          }

                          form.setValue("isRequiredVan", value.length > 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {data?.length === 0 && (
              <Card className="p-3 text-sm text-white bg-red-600">
                <b>Alert:</b> Please created one service-category before create
                a service
              </Card>
            )}
            {!!data === true && data?.length > 0 && (
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data.map((item) => {
                          return (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="isRequiredVan"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Required van</FormLabel>
                    <FormDescription>
                      A van is required for this service
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
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
                        placeholder="Insert a description for this service"
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
