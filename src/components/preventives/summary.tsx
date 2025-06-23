import { differenceInDays, format } from "date-fns";
import type { Preventive, Service } from "@prisma/client";
// @libs
import {
  COST_PER_DOUBLE_ROOM,
  COST_PER_NIGHT,
  COST_PER_SINGLE_ROOM,
  DEFAULT_DATE_FORMATTER,
  TAX,
} from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
// @types
import type { IMeal } from "@/types/meal";
import type { TPreventiveForm } from "@/types/preventive";

interface Props {
  preventive: Preventive | TPreventiveForm;
  meals: Array<IMeal>;
  services: Array<Service>;
  showDescription?: boolean;
  showNumberOfVans?: boolean;
}

export function Summary({ preventive, ...props }: Readonly<Props>) {
  const {
    name,
    checkIn,
    checkOut,
    doubleRooms,
    singleRooms,
    numberOfGuests,
    freeQuote,
    description,
    numberOfVans,
  } = preventive;

  const nights = differenceInDays(checkOut, checkIn);

  const calculateTotalCostForMeals = () => {
    let cost = 0;

    props.meals.forEach((item) => {
      cost = cost + (item.lunch?.cost ?? 0);
      cost = cost + (item.dinner?.cost ?? 0);
    });

    return cost * numberOfGuests;
  };

  const calculateCostForService = (service: Service) => {
    const { costPerPerson, groupCost, vanCost } = service;

    return (
      costPerPerson * numberOfGuests + groupCost + vanCost * (numberOfVans ?? 0)
    );
  };

  const calculateTotalCostForServices = () => {
    let cost = 0;

    props.services.forEach((item) => {
      cost = cost + calculateCostForService(item);
    });

    return cost;
  };

  const calculateTotalBasesCost = () => {
    let cost = 0;

    if ("costPerDoubleRoom" in preventive) {
      cost = cost + doubleRooms * preventive.costPerDoubleRoom;
    } else {
      cost = cost + doubleRooms * COST_PER_DOUBLE_ROOM;
    }

    if ("costPerSingleRoom" in preventive) {
      cost = cost + singleRooms * preventive.costPerSingleRoom;
    } else {
      cost = cost + singleRooms * COST_PER_SINGLE_ROOM;
    }

    cost = cost * nights;
    return cost;
  };

  const calculateTotalCost = () => {
    let cost = 0;

    cost = cost + calculateTotalBasesCost();
    cost = cost + calculateTotalCostForMeals();
    cost = cost + calculateTotalCostForServices();

    return cost;
  };

  const calculateTotalCostWithTax = () => {
    let cost = calculateTotalCost();

    if ("tax" in preventive) {
      cost = cost + (cost * preventive.tax) / 100;
    } else {
      cost = cost + (cost * TAX) / 100;
    }

    return cost;
  };

  const calculateCostForGuest = () => {
    return calculateTotalCostWithTax() / (numberOfGuests - (freeQuote ?? 0));
  };

  return (
    <section className="space-y-4 italic">
      <div className="space-y-2">
        <h4 className="text-lg font-extrabold">Bases costs</h4>
        <div className="flex justify-between">
          <p>Cost per night:</p>
          <p>{formatPrice(COST_PER_NIGHT)}</p>
        </div>
        <div className="flex justify-between">
          <p>Cost per double room:</p>
          <p>{formatPrice(COST_PER_DOUBLE_ROOM)}</p>
        </div>
        <div className="flex justify-between">
          <p>Cost per single room:</p>
          <p>{formatPrice(COST_PER_SINGLE_ROOM)}</p>
        </div>
      </div>
      <hr />
      <div className="space-y-2">
        <h4 className="text-lg font-extrabold">Preventive&#39;s name</h4>
        <p>{name}</p>
      </div>
      <hr />
      <div className="space-y-2">
        <h4 className="text-lg font-extrabold">Arrival and departure</h4>
        <div className="flex justify-between">
          <p>Number of guests</p>
          <p>{numberOfGuests}</p>
        </div>
        <div className="flex justify-between">
          <p>Free quote</p>
          <p>{freeQuote}</p>
        </div>
        <div className="flex justify-between">
          <p>Check in</p>
          <p>{format(checkIn, DEFAULT_DATE_FORMATTER)}</p>
        </div>
        <div className="flex justify-between">
          <p>Check out</p>
          <p>{format(checkOut, DEFAULT_DATE_FORMATTER)}</p>
        </div>
        <div className="flex justify-between">
          <p>Number of nights</p>
          <p>{nights}</p>
        </div>
        <div className="flex justify-between">
          <p>Number of double rooms</p>
          <p>{doubleRooms}</p>
        </div>
        <div className="flex justify-between">
          <p>Number of single rooms</p>
          <p>{singleRooms}</p>
        </div>
        <div className="flex justify-between">
          <p>Total cost for bases:</p>
          <p>{formatPrice(calculateTotalBasesCost())}</p>
        </div>
      </div>
      <hr />
      <div className="space-y-2">
        <h4 className="text-lg font-extrabold">Meals</h4>
        {props.meals.length === 0 && (
          <p>
            Check-in and check-out dates are the same, so meal selection is
            disabled.
          </p>
        )}
        {props.meals.length > 0 &&
          props.meals.map((item) => {
            const { lunch, dinner } = item;

            return (
              <div key={item.date.toString()}>
                <p>Day: {format(item.date, "PPP")}</p>
                <div className="flex justify-between">
                  <p>
                    Lunch: {lunch?.name ? lunch.name : "No"}{" "}
                    {lunch?.description && `(${lunch?.description})`}
                  </p>
                  <p>{formatPrice(lunch?.cost ?? 0)}</p>
                </div>
                <div className="flex justify-between">
                  <p>
                    Dinner: {dinner?.name ? dinner.name : "No"}{" "}
                    {dinner?.description && `(${dinner?.description})`}
                  </p>
                  <p>{formatPrice(dinner?.cost ?? 0)}</p>
                </div>
              </div>
            );
          })}
        <div className="flex justify-between">
          <p>Total cost for meals per number of guests:</p>
          <p>{formatPrice(calculateTotalCostForMeals())}</p>
        </div>
      </div>
      <hr />
      <div className="space-y-2">
        <h4 className="text-lg font-extrabold">Services</h4>
        {props.services.length === 0 && <p>No services were selected</p>}
        {props.services.length > 0 &&
          props.services.map((item) => {
            return (
              <div key={item.id} className="flex justify-between">
                <p>
                  {item.name}
                  {item.isRequiredVan === true && <span> (Required van)</span>}
                </p>
                <p>{formatPrice(calculateCostForService(item))} </p>
              </div>
            );
          })}
        <div className="flex justify-between">
          <p>Total cost for services:</p>
          <p>{formatPrice(calculateTotalCostForServices())}</p>
        </div>
      </div>
      <hr />
      {props.showDescription === true && !!description === true && (
        <>
          <div className="space-y-2">
            <h4 className="text-lg font-extrabold">Description</h4>
            <p>{description}</p>
          </div>
          <hr />
        </>
      )}
      {props.showNumberOfVans === true && (
        <>
          <div className="space-y-2">
            <h4 className="text-lg font-extrabold">Number of vans</h4>
            <p>{numberOfVans}</p>
          </div>
          <hr />
        </>
      )}
      <div className="space-y-2">
        <h4 className="text-lg font-extrabold">Total cost</h4>
        <div className="flex justify-between">
          <p>Total:</p>
          <p>{formatPrice(calculateTotalCost())}</p>
        </div>
        <div className="flex justify-between">
          <p>
            Total with il Tesoro Experiences services (+
            {"tax" in preventive === true ? preventive.tax : TAX}%):
          </p>
          <p>{formatPrice(calculateTotalCostWithTax())}</p>
        </div>
        <div className="flex justify-between">
          <p>Total pay for guests ({numberOfGuests - (freeQuote ?? 0)}):</p>
          <p>{formatPrice(calculateCostForGuest())}</p>
        </div>
      </div>
    </section>
  );
}
