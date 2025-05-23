import { StepNavigation } from "./components/step-navigation";
import { CreatePreventiveProvider } from "@/context/create-preventive";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  return (
    <CreatePreventiveProvider>
      <h2 className="text-2xl font-extrabold">
        Build Your &#34;Il Tesoro Group Experience&#34;
      </h2>
      <div className="mt-4 space-y-4">
        <StepNavigation />
        {children}
      </div>
    </CreatePreventiveProvider>
  );
}
