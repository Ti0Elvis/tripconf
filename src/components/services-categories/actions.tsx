"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontalIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ServiceCategory } from "@prisma/client";
// @actions
import { updateServiceCategory } from "@/app/services-categories/actions";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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

interface Props {
  serviceCategory: ServiceCategory;
}

export function ServiceCategoryActions({ serviceCategory }: Readonly<Props>) {
  const [openDropdownMenu, setOpenDropdownMenu] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const router = useRouter();
  const { dismiss, toast } = useToast();

  const form = useForm<TServiceCategoryForm>({
    resolver: zodResolver(ServiceCategoryForm),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({ ...serviceCategory });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openUpdateDialog]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-service-category"],
    mutationFn: async (values: TServiceCategoryForm) => {
      const { error } = await updateServiceCategory(serviceCategory.id, values);

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
        title: "Service category updated successfully",
      });
    },
  });

  return (
    <DropdownMenu open={openDropdownMenu} onOpenChange={setOpenDropdownMenu}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
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
            <DialogTitle className="font-bold">
              Service category form
            </DialogTitle>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
