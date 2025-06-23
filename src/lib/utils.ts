import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatPrice(price: number) {
  const formatter = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  });

  return formatter.format(price);
}
