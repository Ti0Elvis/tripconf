"use client";
import { motion } from "motion/react";
// @components
import { Meals } from "@/components/preventives/meals";
import { Confirm } from "@/components/preventives/confirm";
import { Services } from "@/components/preventives/services";
import { ArrivalAndDeparture } from "@/components/preventives/arrival-and-departure";
// @hooks
import { usePreventiveForm } from "@/hooks/use-preventive-form";

const COMPONENTS = [ArrivalAndDeparture, Meals, Services, Confirm];

export default function Page() {
  const { step } = usePreventiveForm();

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
      ),
  );
}
