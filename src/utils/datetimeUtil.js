import formatDate from "date-and-time";
import en from "date-and-time/locale/en";
import vi from "date-and-time/locale/vi";

const getNext7DaysFrom = (date = new Date()) => {
  const curDate = new Date(date);
  curDate.setHours(0);
  curDate.setMinutes(0);
  curDate.setSeconds(0);
  curDate.setMilliseconds(0);

  const arr = [];
  for (let i = 0; i <= 6; i++) {
    const nextDate = new Date(curDate);
    nextDate.setDate(curDate.getDate() + i);
    arr.push(nextDate);
  }

  return arr;
};

const formatDateLocale = { en, vi };

const getWeekByDate = (date = new Date()) => {
  const daysInWeek = 7;
  const week = [];

  // Tính toán ngày đầu tiên của tuần bắt đầu từ thứ 2
  const firstDay = new Date(date);
  const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
  firstDay.setDate(diff);

  // Thêm 7 ngày vào mảng tuần
  for (let i = 0; i < daysInWeek; i++) {
    const nextDay = new Date(firstDay);
    nextDay.setDate(firstDay.getDate() + i);
    week.push(nextDay);
  }

  return week;
};

// Chuyển h,m,s và ms về 0 để khi dùng cho hàm subtract
// nếu ko được subtract thì kết quả trừ sẽ bị chênh lệch
const normalizeDate = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  return newDate;
};

// return date1 - date2
const subtractDate = (date1, date2) => {
  const d1 = normalizeDate(date1);
  const d2 = normalizeDate(date2);

  const daysBetween = formatDate.subtract(d1, d2).toDays();

  return daysBetween;
};

export { getNext7DaysFrom, formatDateLocale, getWeekByDate, subtractDate };