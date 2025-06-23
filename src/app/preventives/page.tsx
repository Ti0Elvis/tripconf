import Link from "next/link";
// @actions
import { deletePreventives, getPreventives } from "./actions";
// @components
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Delete } from "@/components/data-table/delete";
import { DataTable } from "@/components/data-table/data-table";
import { Pagination } from "@/components/data-table/pagination";
import { GlobalInput } from "@/components/data-table/global-input";
// @context
import { DataTableProvider } from "@/context/data-table";
// @libs
import { DEFAULT_ERROR_MESSAGE } from "@/lib/constants";

export default async function Page() {
  try {
    const data = await getPreventives();

    return (
      <section>
        <h2 className="text-2xl font-bold">Preventives Table</h2>
        <div className="mt-4">
          <DataTableProvider name="Preventives" columns={columns} data={data}>
            <div className="w-full flex flex-col items-center justify-between gap-2 md:gap-0 md:flex-row">
              <GlobalInput className="w-full md:w-96" />
              <div className="w-full flex gap-2 mb-4 md:w-auto md:mb-0">
                <Delete callback={deletePreventives} />
                <Button className="flex-grow" asChild>
                  <Link href="/preventives/create">Create a preventive</Link>
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <DataTable />
              <Pagination />
            </div>
          </DataTableProvider>
        </div>
      </section>
    );
  } catch (error) {
    throw new Error((error as Error).message ?? DEFAULT_ERROR_MESSAGE);
  }
}
