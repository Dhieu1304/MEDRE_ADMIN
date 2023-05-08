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

const getWeekByDate = (date = new Date(), startDayOfWeek = 0) => {
  const daysInWeek = 7;
  const week = [];

  // Tính toán ngày đầu tiên của tuần dựa trên startDayOfWeek
  const firstDay = new Date(date);
  const diff = (date.getDay() - startDayOfWeek + daysInWeek) % daysInWeek;
  firstDay.setDate(date.getDate() - diff);

  // Thêm 7 ngày vào mảng tuần
  for (let i = 0; i < daysInWeek; i++) {
    const nextDay = new Date(firstDay);
    nextDay.setDate(firstDay.getDate() + i);
    week.push(nextDay);
  }

  // console.log("week: ", week);
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

const isEqualDateWithoutTime = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Kiểm date có nằm giữa dateLeft và dateRight hay ko? (ko tính trường hợp date === dateLeft, date === dateRight)
const isBetweenAndNoEqual = (date, dateLeft, dateRight) => {
  return date > dateLeft && date < dateRight;
};

const isBetweenOrEqualWithoutTime = (date, dateLeft, dateRight) => {
  // Đặt giờ của ngày tháng năm để cùng là 12 giờ trưa (12:00:00)
  date.setHours(12, 0, 0, 0);
  dateLeft.setHours(12, 0, 0, 0);
  dateRight.setHours(12, 0, 0, 0);

  // Lấy giá trị Unix timestamp tương ứng với ngày tháng năm
  const dateTimestamp = date.getTime();
  const dateLeftTimestamp = dateLeft.getTime();
  const dateRightTimestamp = dateRight.getTime();

  // Kiểm tra liệu ngày `date` có nằm trong khoảng thời gian giữa `dateLeft` và `dateRight` hay không
  return dateLeftTimestamp <= dateTimestamp && dateTimestamp <= dateRightTimestamp;
};

// Taoj ngày từ 1 date object và 1 chuỗi time (hh:mm:ss)
const createDateByDateAndTimeStr = (date, timeStr) => {
  const newDate = new Date(date);
  const [hour, minute, second] = timeStr.split(":");
  newDate.setHours(hour, minute, second, 0);
  // console.log("newDate: ", newDate);
  return newDate;
};

export {
  getNext7DaysFrom,
  formatDateLocale,
  getWeekByDate,
  subtractDate,
  isEqualDateWithoutTime,
  isBetweenOrEqualWithoutTime,
  createDateByDateAndTimeStr,
  isBetweenAndNoEqual
};
