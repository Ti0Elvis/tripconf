"use server";
import {
  PDFDocument,
  PDFFont,
  type PDFPageDrawTextOptions,
  StandardFonts,
} from "pdf-lib";
import type { Service } from "@prisma/client";
import { differenceInDays, format } from "date-fns";
// @db
import { db } from "@/db/prisma";
// @libs
import {
  COST_PER_DOUBLE_ROOM,
  COST_PER_NIGHT,
  COST_PER_SINGLE_ROOM,
  DEFAULT_ERROR_MESSAGE,
  EMAIL_TO_SEND_THE_PDF,
  TAX,
} from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
// @types
import type { ICreatePreventive } from "@/types/preventive";

export async function createPreventive(params: ICreatePreventive) {
  try {
    await db.preventive.create({
      data: {
        ...params.form,
        meals: JSON.stringify(params.meals),
        services: JSON.stringify(params.services),
        tax: TAX,
        costPerNight: COST_PER_NIGHT,
        costPerDoubleRoom: COST_PER_DOUBLE_ROOM,
        costPerSingleRoom: COST_PER_SINGLE_ROOM,
      },
    });

    return { error: undefined };
  } catch (error) {
    return { error: (error as Error) ?? DEFAULT_ERROR_MESSAGE };
  }
}

export async function createPDF(params: ICreatePreventive) {
  try {
    const doc = await PDFDocument.create();
    const width = 600;
    const height = 800;

    const regularBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const italicFont = await doc.embedFont(StandardFonts.HelveticaOblique);
    const italicBoldFont = await doc.embedFont(
      StandardFonts.HelveticaBoldOblique,
    );

    let page = doc.addPage([width, height]);

    const marginX = 50;
    const marginY = 50;

    let currentY = height - 50;
    const currentYMargin = 16;

    const {
      name,
      checkIn,
      checkOut,
      numberOfGuests,
      doubleRooms,
      singleRooms,
      freeQuote,
      description,
      numberOfVans,
    } = params.form;

    const nights = differenceInDays(checkOut, checkIn);

    const calculateTotalCostForMeals = () => {
      let cost = 0;

      params.meals.forEach((item) => {
        cost = cost + (item.lunch?.cost ?? 0);
        cost = cost + (item.dinner?.cost ?? 0);
      });

      return cost * numberOfGuests;
    };

    const calculateCostForService = (service: Service) => {
      const { costPerPerson, groupCost, vanCost } = service;

      return (
        costPerPerson * numberOfGuests +
        groupCost +
        vanCost * (numberOfVans ?? 0)
      );
    };

    const calculateTotalCostForServices = () => {
      let cost = 0;

      params.services.forEach((item) => {
        cost = cost + calculateCostForService(item);
      });

      return cost;
    };

    const calculateTotalBasesCost = () => {
      let cost = 0;

      cost = cost + doubleRooms * COST_PER_DOUBLE_ROOM;
      cost = cost + singleRooms * COST_PER_SINGLE_ROOM;
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

      cost = cost + (cost * TAX) / 100;

      return cost;
    };

    const calculateCostForGuest = () => {
      return calculateTotalCostWithTax() / (numberOfGuests - (freeQuote ?? 0));
    };

    const addWrappedText = (text: string, font: PDFFont, fontSize: number) => {
      const maxWidth = width - 2 * marginX;
      const words = text.split(" ");
      let line = "";
      const lines: string[] = [];

      words.forEach((word) => {
        const testLine = line ? `${line} ${word}` : word;
        const textWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (textWidth < maxWidth) {
          line = testLine;
        } else {
          lines.push(line);
          line = word;
        }
      });

      if (line) lines.push(line);

      lines.forEach((line) => {
        page.drawText(line, {
          x: marginX,
          y: (currentY -= currentYMargin),
          size: fontSize,
          font,
        });
      });
    };

    const addHeader = () => {
      addWrappedText(`Trip configuration request for ${name}`, regularBold, 16);
    };

    const addFooter = () => {
      page.drawText(
        `N.B.: Please sign this document and send it by email to \n ${EMAIL_TO_SEND_THE_PDF} for confirmation`,
        {
          x: marginX,
          y: (currentY -= currentYMargin),
          size: 16,
          font: regularBold,
        },
      );
    };

    const addTitle = (text: string, options?: PDFPageDrawTextOptions) => {
      page.drawText(text, {
        ...options,
        x: marginX,
        y: (currentY -= currentYMargin),
        size: 14,
        font: italicBoldFont,
      });
    };

    const addText = (text: string, options?: PDFPageDrawTextOptions) => {
      page.drawText(text, {
        ...options,
        x: marginX,
        y: (currentY -= currentYMargin),
        size: 12,
        font: italicFont,
      });
    };

    const addPage = () => {
      // We multiply the marginY to be sure the marginY is correct
      if (currentY <= marginY * 2) {
        page = doc.addPage([width, height]);

        currentY = height - 50;

        addHeader();

        currentY = currentY - currentYMargin;
      } else {
        return;
      }
    };

    addHeader();

    currentY = currentY - currentYMargin;

    addTitle("Arrival and departure");
    addText(`Number of guests: ${numberOfGuests} (+ ${freeQuote} free)`);
    addText(`Check in: ${format(checkIn, "PPP")}`);
    addText(`Check out: ${format(checkOut, "PPP")}`);
    addText(`Number of nights: ${nights}`);
    addText(`Total cost for bases: ${formatPrice(calculateTotalBasesCost())}`);

    currentY = currentY - currentYMargin;

    addPage();

    addTitle("Rooms");
    addText(`Double rooms: ${doubleRooms}`);
    addText(`Single rooms: ${singleRooms}`);

    currentY = currentY - currentYMargin;

    addPage();

    addTitle("Meals");
    if (params.meals.length === 0) {
      addText(
        "Check-in and check-out dates are the same, so meal selection is disabled",
      );
    } else {
      params.meals.forEach((item, index) => {
        addText(`Day ${index + 1}: (${format(item.date, "MM/dd/yyyy")})`);
        addText(
          `Lunch: ${item.lunch?.name ?? "No"} (${formatPrice(
            item.lunch?.cost ?? 0,
          )})`,
        );
        addText(
          `Dinner: ${item.dinner?.name ?? "No"} (${formatPrice(
            item.dinner?.cost ?? 0,
          )})`,
        );

        addPage();
      });
      addText(
        `Total cost for meals per number of guests: ${formatPrice(
          calculateTotalCostForMeals(),
        )}`,
      );
    }

    currentY = currentY - currentYMargin;

    addPage();

    addTitle("Services");
    if (params.services.length === 0) {
      addText("No services were selected");
    } else {
      params.services.forEach((item) => {
        addText(`${item.name} (${formatPrice(calculateCostForService(item))})`);

        addPage();
      });
      addText(
        `Total cost for meals per number of guests: ${formatPrice(
          calculateTotalCostForServices(),
        )}`,
      );
    }

    currentY = currentY - currentYMargin;

    addPage();

    if (!!description === true) {
      addTitle("Description");
      addText(description);

      currentY = currentY - currentYMargin;

      addPage();
    }

    if (!!numberOfVans === true) {
      addTitle("Number of vans");
      addText(numberOfVans.toString());

      currentY = currentY - currentYMargin;

      addPage();
    }

    addTitle("Total cost");
    addText(`Total: ${formatPrice(calculateTotalCost())}`);
    addText(
      `Total with il Tesoro Experiences services (+${TAX}%): ${formatPrice(
        calculateTotalCostWithTax(),
      )}`,
    );
    addText(
      `Total pay for guests (${
        numberOfGuests - (freeQuote ?? 0)
      }): ${formatPrice(calculateCostForGuest())}`,
    );

    currentY = currentY - 120;

    addPage();

    addTitle("___________________________");
    currentY = currentY - currentYMargin;
    addFooter();

    return {
      buffer: await doc.save(),
      error: undefined,
    };
  } catch (error) {
    return {
      buffer: undefined,
      error: (error as Error) ?? DEFAULT_ERROR_MESSAGE,
    };
  }
}
