import { format } from "date-fns";
// @actions
import { getPreventive } from "./actions";
// @components
import { Card } from "@/components/ui/card";
import { Summary } from "@/components/preventives/summary";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Readonly<Props>) {
  try {
    const { id } = await params;
    const { preventive, error } = await getPreventive(id);

    if (error !== undefined) {
      throw new Error(error);
    }

    const { meals, services, ...values } = preventive;

    return (
      <section>
        <h2 className="text-2xl font-bold">Preventive Description</h2>
        <p>Created at: {format(preventive.createdAt, "PPP")}</p>
        <Card className="mt-4 p-4 bg-background">
          <Summary
            preventive={values}
            meals={meals}
            services={services}
            showDescription
            showNumberOfVans
          />
        </Card>
      </section>
    );
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
