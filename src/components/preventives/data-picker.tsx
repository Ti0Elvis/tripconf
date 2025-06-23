"use client";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
// @components
import { Button } from "../ui/button";
import { FormControl } from "../ui/form";
import { Calendar, type CalendarProps } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Props = {
  triggerText: string;
} & CalendarProps;

export function DataPicker({ triggerText, ...props }: Readonly<Props>) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button variant="outline" className="w-full justify-between md:w-72">
            {triggerText}
            <CalendarIcon className="w-4 h-4" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <Calendar onDayClick={() => setOpen(false)} {...props} />
      </PopoverContent>
    </Popover>
  );
}
