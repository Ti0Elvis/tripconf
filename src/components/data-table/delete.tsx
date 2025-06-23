"use client";
import { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
// @components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
// @hooks
import { useToast } from "@/hooks/use-toast";
import { useDataTable } from "@/hooks/use-data-table";
// @libs
import { delay } from "@/lib/utils";

interface Props {
  callback: (ids: Array<string>) => Promise<{ error: string | undefined }>;
}

export function Delete({ callback }: Readonly<Props>) {
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  const { name, table } = useDataTable();

  const router = useRouter();
  const { dismiss, toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: [`delete-many-${name}`],
    mutationFn: async () => {
      const rows = table.getSelectedRowModel().rows;
      const ids = rows.map((row) => row.original.id);

      const { error } = await callback(ids);

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
      table.resetRowSelection();

      await delay(500);
      setOpenAlertDialog(false);

      toast({
        title: `${name} deleted successfully`,
      });
    },
  });

  const openAlert = () => {
    dismiss();

    const rows = table.getSelectedRowModel().rows;

    if (rows.length === 0) {
      toast({
        title: `Please select at least one ${name}`,
        variant: "destructive",
      });

      return;
    }

    setOpenAlertDialog(true);
  };

  return (
    <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={openAlert}>
              <Trash2Icon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete {name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogTitle>
          Are you sure you want to delete these {name}?
        </AlertDialogTitle>
        <AlertDialogDescription className="hidden" />
        <div className="w-full flex gap-2 justify-end">
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => setOpenAlertDialog(false)}>
            Cancel
          </Button>
          <Button disabled={isPending} onClick={() => mutate()}>
            {isPending ? "Loading..." : "Delete"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
