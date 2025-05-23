"use client";
import { motion } from "motion/react";
import { Meals } from "./components/meals";
import { Confirm } from "./components/confirm";
import { Services } from "./components/services";
import { useCreatePreventive } from "@/hooks/use-create-preventive";
import { ArrivalAndDeparture } from "./components/arrival-and-departure";

const COMPONENTS = [ArrivalAndDeparture, Meals, Services, Confirm];

export default function Page() {
  const { step } = useCreatePreventive();

  const ANIMATION = {
    initial: { x: "-10%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
    transition: { duration: 0.25 },
  };

  return COMPONENTS.map(
    (Component, index) =>
      step === index && (
        <motion.section key={index} className="mt-4 space-y-4" {...ANIMATION}>
          <Component />
        </motion.section>
      )
  );
}
