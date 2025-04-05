import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type groupByTimePeriodsType = { createdAt: Date; [k: string]: any };

export function groupByTimePeriods(data: groupByTimePeriodsType[]) {
  // Lấy thời gian hiện tại theo local timezone của device
  const todayLocal = new Date();
  // Chuẩn hóa về đầu ngày theo local timezone của device
  const today = new Date(todayLocal);
  today.setHours(0, 0, 0, 0);

  const groups: {
    Today: groupByTimePeriodsType[];
    Yesterday: groupByTimePeriodsType[];
    "Last 7 days": groupByTimePeriodsType[];
    "Last 30 days": groupByTimePeriodsType[];
    "Last 6 months": groupByTimePeriodsType[];
    "Last 1 year": groupByTimePeriodsType[];
    "Last 2 years": groupByTimePeriodsType[];
    "Last 3 years": groupByTimePeriodsType[];
    Older: groupByTimePeriodsType[];
  } = {
    Today: [],
    Yesterday: [],
    "Last 7 days": [],
    "Last 30 days": [],
    "Last 6 months": [],
    "Last 1 year": [],
    "Last 2 years": [],
    "Last 3 years": [],
    Older: [],
  };

  // Tính các mốc thời gian dựa trên local timezone
  const oneDayAgo = new Date(today);
  oneDayAgo.setDate(today.getDate() - 1);

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const twoYearsAgo = new Date(today);
  twoYearsAgo.setFullYear(today.getFullYear() - 2);

  const threeYearsAgo = new Date(today);
  threeYearsAgo.setFullYear(today.getFullYear() - 3);

  data.forEach((item) => {
    const itemDate = new Date(item.createdAt);
    itemDate.setHours(0, 0, 0, 0);

    if (itemDate.getTime() === today.getTime()) {
      groups["Today"].push(item);
    } else if (itemDate.getTime() === oneDayAgo.getTime()) {
      groups["Yesterday"].push(item);
    } else if (itemDate > sevenDaysAgo) {
      groups["Last 7 days"].push(item);
    } else if (itemDate > thirtyDaysAgo) {
      groups["Last 30 days"].push(item);
    } else if (itemDate > sixMonthsAgo) {
      groups["Last 6 months"].push(item);
    } else if (itemDate > oneYearAgo) {
      groups["Last 1 year"].push(item);
    } else if (itemDate > twoYearsAgo) {
      groups["Last 2 years"].push(item);
    } else if (itemDate > threeYearsAgo) {
      groups["Last 3 years"].push(item);
    } else {
      groups["Older"].push(item);
    }
  });

  return groups;
}
