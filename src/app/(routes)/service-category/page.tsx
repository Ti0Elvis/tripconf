import { Fragment } from "react";
import {
  DataTable,
  DataTableGlobalInput,
  DataTableProvider,
  Pagination,
} from "@/components/ui/data-table";
import { columns } from "./columns";
import { redirect } from "next/navigation";
import { findAllServicesCategories } from "./actions";
import { ServiceCategoryForm } from "./components/service-category-form";

export default async function Page() {
  try {
    const services_categories = await findAllServicesCategories();

    return (
      <Fragment>
        <h2 className="text-2xl font-bold">Services Categories Table</h2>
        <div className="mt-4">
          <DataTableProvider
            name="services-categories"
            columns={columns}
            data={services_categories}>
            <div className="w-full flex flex-col items-center justify-between gap-2 md:gap-0 md:flex-row">
              <DataTableGlobalInput className="w-full md:w-96" />
              <div className="w-full flex gap-2 mb-4 md:w-auto md:mb-0">
                <ServiceCategoryForm />
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
