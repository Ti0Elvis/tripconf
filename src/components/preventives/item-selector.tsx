"use client";
// @libs
import { cn } from "@/lib/utils";

interface Props {
  valueSelected: number;
  array: Array<number>;
  onClick: (item: number) => void;
}

export function ItemSelector(props: Readonly<Props>) {
  return (
    <div className="flex flex-wrap gap-2">
      {props.array.map((item) => {
        return (
          <span
            key={item}
            className={cn(
              "min-w-8 min-h-8 px-2 flex justify-center items-center text-sm font-extrabold cursor-pointer border border-primary rounded-full",
              props.valueSelected === item
                ? "bg-primary text-white"
                : "hover:bg-primary/40",
            )}
            onClick={() => props.onClick(item)}>
            {item}
          </span>
        );
      })}
    </div>
  );
}
