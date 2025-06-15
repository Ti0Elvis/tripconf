export const USERNAME = process.env._USERNAME;
export const PASSWORD = process.env._PASSWORD;

export const MIN_NUMBER_OF_GUESTS = 2;
export const MAX_NUMBER_OF_GUESTS = 32;

export const MAX_DOUBLE_ROOMS = 16;
export const MAX_SINGLE_ROOMS = 16;

export const MAX_FREE_QUOTE = 3;

export const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;
export const DAYS_TO_EXPIRE_TOKEN = 7;

export const DEFAULT_ERROR_MESSAGE = "Fatal error, please try again later.";

export const DEFAULT_DATE_FORMATTER = "MM/dd/yyyy";

export const TAX = 20;
export const COST_PER_NIGHT = 115;
export const COST_PER_DOUBLE_ROOM = 230;
export const COST_PER_SINGLE_ROOM = 180;

export const NUMBER_OF_GUESTS_PER_VAN = 7;
export const MAX_NUMBER_OF_VANS = Math.ceil(
  MAX_NUMBER_OF_GUESTS / NUMBER_OF_GUESTS_PER_VAN
);
