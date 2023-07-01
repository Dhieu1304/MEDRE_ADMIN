import formatDate from "date-and-time";
import { statisticsFilterTypes } from "../../entities/statistics";
import { normalizeStrToDateStr, normalizeStrToStr } from "../../utils/standardizedForForm";

export const formatterStatisticsTime = (value, time) => {
  const datetime = new Date(value);
  switch (time) {
    case statisticsFilterTypes.DAY:
      return formatDate.format(datetime, "DD/MM/YYYY");
    case statisticsFilterTypes.WEEK:
      return formatDate.format(datetime, "DD/MM/YYYY");
    case statisticsFilterTypes.MONTH:
      return formatDate.format(datetime, "DD/MM/YYYY");
    case statisticsFilterTypes.YEAR:
      return formatDate.format(datetime, "DD/MM/YYYY");
    default:
      return "";
  }
};

export const getDateRangeOfWeek = (date, isLast) => {
  const firstDateOfWeek = new Date(date.getTime());
  firstDateOfWeek.setDate(date.getDate() - date.getDay());

  const lastDateOfWeek = new Date(date.getTime());
  lastDateOfWeek.setDate(date.getDate() + (6 - date.getDay()));

  if (isLast) {
    return `${formatDate.format(firstDateOfWeek, "DD/MM/YYYY")} - ${formatDate.format(date, "DD/MM/YYYY")}`;
  }
  return `${formatDate.format(date, "DD/MM/YYYY")} - ${formatDate.format(lastDateOfWeek, "DD/MM/YYYY")}`;
};

export const getDateRangeOfMonth = (date, isLast) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const firstDateOfMonth = new Date(year, month - 1, 1);
  const lastDateOfMonth = new Date(year, month, 0);

  if (isLast) {
    return `${formatDate.format(firstDateOfMonth, "DD/MM/YYYY")} - ${formatDate.format(date, "DD/MM/YYYY")}`;
  }
  return `${formatDate.format(date, "DD/MM/YYYY")} - ${formatDate.format(lastDateOfMonth, "DD/MM/YYYY")}`;
};

export const getDateRangeOfYear = (date, isLast) => {
  const year = date.getFullYear();

  const firstDateOfYear = new Date(year, 0, 1);
  const lastDateOfYear = new Date(year, 11, 31);

  if (isLast) {
    return `${formatDate.format(firstDateOfYear, "DD/MM/YYYY")} - ${formatDate.format(date, "DD/MM/YYYY")}`;
  }
  return `${formatDate.format(date, "DD/MM/YYYY")} - ${formatDate.format(lastDateOfYear, "DD/MM/YYYY")}`;
};

export const createDefaultValues = ({ from, to, time } = {}) => {
  const result = {
    from: normalizeStrToDateStr(from, new Date(2023, 0, 1)),
    to: normalizeStrToDateStr(to, new Date()),
    time: normalizeStrToStr(time) || statisticsFilterTypes.DAY
  };

  return result;
};
