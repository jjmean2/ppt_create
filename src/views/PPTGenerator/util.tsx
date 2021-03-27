import { addDays, format, getDay } from "date-fns";

export const getDefaultPPTFilename = (): string => {
  const today = new Date();
  // 0 is Sunday 6 is Saturday
  const weekday = getDay(today);
  const distanceToSunday = (7 - weekday) % 7;
  const nextSunday = addDays(today, distanceToSunday);
  const sundayText = format(nextSunday, "yyyy-MM-dd");
  return "테힐라 찬양 " + sundayText;
};
