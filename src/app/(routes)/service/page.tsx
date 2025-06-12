import { Fragment } from "react";
import {
  DataTable,
  DataTableGlobalInput,
  DataTableProvider,
  Pagination,
} from "@/components/ui/data-table";
import { columns } from "./columns";
import { redirect } from "next/navigation";
import { findAllServices } from "./actions";
import { ServiceForm } from "./components/service-form";

export default async function Page() {
  try {
    const services = await findAllServices();

    return (
      <Fragment>
        <h2 className="text-2xl font-bold">Service Table</h2>
        <div className="mt-4">
          <DataTableProvider name="services" columns={columns} data={services}>
            <div className="w-full flex flex-col items-center justify-between gap-2 md:gap-0 md:flex-row">
              <DataTableGlobalInput className="w-full md:w-96" />
              <div className="w-full flex gap-2 mb-4 md:w-auto md:mb-0">
                <ServiceForm />
              </div>
            </div>
            <div className="mt-4">
              <DataTable />
              <Pagination />
            </div>
          </DataTableProvider>
        </div>
      </Fragment>
    );
  } catch (error) {
    console.error(error);
    return redirect("/error");
  }
}
