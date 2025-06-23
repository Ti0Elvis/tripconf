import { useContext } from "react";
// @context
import { GlobalContext } from "@/context/global";

export function useGlobal() {
  return useContext(GlobalContext)!;
}
