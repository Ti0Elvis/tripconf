"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Service } from "@prisma/client";
import { MoreHorizontalIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
// @actions
import { updateService } from "@/app/services/actions";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
// @hooks
import { useToast } from "@/hooks/use-toast";
// @libs
import { ServiceForm } from "@/lib/schemas";
import { delay, formatPrice } from "@/lib/utils";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";
// @types
import type { TServiceForm } from "@/types/service";

interface Props {
  service: Service & {
    category: {
      name: string;
      id: string;
    };
  };
}

export function ServiceActions({ service }: Readonly<Props>) {
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDropdownMenu, setOpenDropdownMenu] = useState(false);

  const router = useRouter();
  const { dismiss, toast } = useToast();

  const form = useForm<TServiceForm>({
    resolver: zodResolver(ServiceForm),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({
      ...service,
      costPerPerson: String(service.costPerPerson),
      groupCost: String(service.groupCost),
      vanCost: String(service.vanCost),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openUpdateDialog]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-service"],
    mutationFn: async (values: TServiceForm) => {
      const { error } = await updateService(service.id, values);

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
        title: "Service updated successfully",
      });
    },
  });

  const { data, error } = useQuery({
    queryKey: ["get-categories"],
    queryFn: async () => await getServicesCategories(),
  });

  if (!!error === true) {
    throw new Error(error.message ?? DEFAULT_ERROR_MESSAGE);
  }

  const {
    name,
    costPerPerson,
    groupCost,
    description,
    isRequiredVan,
    vanCost,
    category,
  } = service;

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
            <DialogTitle className="font-bold">Service details</DialogTitle>
            <DialogDescription className="hidden" />
            <section className="space-y-4 italic">
              <div>
                <h2 className="font-bold">Name</h2>
                <p className="text-sm">{name}</p>
              </div>
              <hr />
              <div>
                <h2 className="font-bold">Cost per person</h2>
                <p className="text-sm">{formatPrice(costPerPerson ?? 0)}</p>
              </div>
              <hr />
              <div>
                <h2 className="font-bold">Group cost</h2>
                <p className="text-sm">{formatPrice(groupCost ?? 0)}</p>
              </div>
              <hr />
              <div>
                <h2 className="font-bold">Van cost</h2>
                <p className="text-sm">{formatPrice(vanCost ?? 0)}</p>
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
                <h2 className="font-bold">Category</h2>
                <p className="text-sm">{category.name}</p>
              </div>
              <hr />
              <div>
                <h2 className="font-bold">Required van</h2>
                <p className="text-sm">
                  {isRequiredVan === true ? "Yes" : "No"}
                </p>
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
