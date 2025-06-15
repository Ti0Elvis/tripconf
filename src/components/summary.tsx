import { z } from "zod";
import {
  COST_PER_DOUBLE_ROOM,
  COST_PER_NIGHT,
  COST_PER_SINGLE_ROOM,
  DEFAULT_DATE_FORMATTER,
} from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { Preventive } from "@prisma/client";
import { differenceInDays, format } from "date-fns";
import { schema } from "@/app/(routes)/preventive/create/schema";

interface Props {
  preventive: Preventive | z.infer<typeof schema>;
}

export function Summary({ preventive }: Readonly<Props>) {
  const nights = differenceInDays(preventive.check_out, preventive.check_in);

  return (
    <section className="space-y-4 italic">
      <div>
        <h3 className="text-lg font-semibold">Main costs</h3>
        <div className="flex justify-between">
          <p>Cost per night:</p>
          <p>
            {formatPrice(
              "cost_per_night" in preventive
                ? preventive.cost_per_night
                : COST_PER_NIGHT
            )}
          </p>
        </div>
        <div className="flex justify-between">
          <p>Cost per double room:</p>
          <p>
            {formatPrice(
              "cost_per_double_room" in preventive
                ? preventive.cost_per_double_room
                : COST_PER_DOUBLE_ROOM
            )}
          </p>
        </div>
        <div className="flex justify-between">
          <p>Cost per single room:</p>
          <p>
            {formatPrice(
              "cost_per_single_room" in preventive
                ? preventive.cost_per_single_room
                : COST_PER_SINGLE_ROOM
            )}
          </p>
        </div>
      </div>
      <hr />
      <div>
        <h3 className="text-lg font-semibold">About preventive</h3>
        <div className="flex justify-between">
          <p>Name:</p>
          <p>{preventive.name}</p>
        </div>
        <div className="flex justify-between">
          <p>Number of guests:</p>
          <p>{preventive.number_of_guests}</p>
        </div>
        <div className="flex justify-between">
          <p>Check in:</p>
          <p>{format(preventive.check_in, DEFAULT_DATE_FORMATTER)}</p>
        </div>
        <div className="flex justify-between">
          <p>Check out:</p>
          <p>{format(preventive.check_out, DEFAULT_DATE_FORMATTER)}</p>
        </div>
        <div className="flex justify-between">
          <p>Number of nights:</p>
          <p>{nights}</p>
        </div>
        <div className="flex justify-between">
          <p>Number of double rooms:</p>
          <p>{preventive.double_rooms}</p>
        </div>
        <div className="flex justify-between">
          <p>Number of single rooms:</p>
          <p>{preventive.single_rooms}</p>
        </div>
      </div>
    </section>
  );
}
