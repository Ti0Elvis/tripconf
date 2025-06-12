"use client";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { create } from "../actions";
import { useForm } from "react-hook-form";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { findAllServicesCategories } from "../../service-category/actions";

export const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  description: z.string().optional(),
  isRequiredVan: z.boolean().optional(),
  // These values are handled as a string in the form, but represents a numeric value
  categoryId: z.string(),
  vanCost: z.string().optional(),
  groupCost: z.string().optional(),
  costPerPerson: z.string().optional(),
});

export function ServiceForm() {
  const [dialog, setDialog] = useState(false);

  const { refresh } = useRouter();
  const { dismiss, toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
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
    if (dialog === false) {
      form.reset();
    }

    dismiss();
  }, [dialog]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-service"],
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
        title: "Service created successfully",
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

  const { data, error } = useQuery({
    queryKey: ["find-all-services-categories"],
    queryFn: async () => await findAllServicesCategories(),
  });

  if (error !== null) {
    throw new Error(error.message ?? DEFAULT_ERROR_MESSAGE);
  }

  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
      <DialogTrigger asChild>
        <Button className="flex-grow">Create service</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-bold">Service form</DialogTitle>
        <DialogDescription className="hidden" />
        {data !== undefined && data.length > 0 && (
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
                name="categoryId"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data.map((e) => {
                            return (
                              <SelectItem key={e.id} value={String(e.id)}>
                                {e.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="isRequiredVan"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Required van</FormLabel>
                      <FormDescription>
                        A van is required for this service?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        aria-readonly
                        checked={field.value}
                        className="cursor-pointer"
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch("isRequiredVan") === true && (
                <FormField
                  name="vanCost"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Van cost</FormLabel>
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
                                form.setValue("vanCost", value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}
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
        )}
        {data !== undefined && data.length === 0 && (
          <Card className="p-4 gap-2 text-sm text-white bg-red-600/50 border-red-600 border-2">
            <b>Alert:</b> Please created one service category before create a
            service
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
