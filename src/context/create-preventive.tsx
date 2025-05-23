"use client";
import { createContext, useState } from "react";

interface Context {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export const CreatePreventiveContext = createContext<null | Context>(null);

interface Props {
  children: React.ReactNode;
}

export function CreatePreventiveProvider({ children }: Readonly<Props>) {
  const [step, setStep] = useState(0);

  const context: Context = {
    step,
    setStep,
  };

  return (
    <CreatePreventiveContext.Provider value={context}>
      {children}
    </CreatePreventiveContext.Provider>
  );
}
