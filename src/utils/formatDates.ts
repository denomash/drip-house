import { format, subHours } from "date-fns";

export const formatAsLocalDateTime = (date: Date | string): string =>
  date
    ? format(checkTZHelper(date), "dd MMM yyyy h:mm:ssaaaa").replaceAll(".", "")
    : "-";

/**
 * @description Sub 3 hrs to UTC dates to correct localization
 * @param {string|Date} date
 * @returns
 */
export const checkTZHelper = (date: Date | string) =>
  `${date}`.includes("Z") ? subHours(new Date(date), 3) : new Date(date);
