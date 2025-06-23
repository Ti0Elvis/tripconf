// @context
import { PreventiveFormProvider } from "@/context/preventive-form";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  return (
    <>
      <h2 className="text-2xl font-extrabold">
        Build Your &#34;Il Tesoro Group Experience&#34;
      </h2>
      <PreventiveFormProvider>{children}</PreventiveFormProvider>
    </>
  );
}
