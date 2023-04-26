import { scheduleSessions } from "../../../entities/Schedule";
import { createDateByDateAndTimeStr, isBetweenAndNoEqual, isEqualDateWithoutTime } from "../../../utils/datetimeUtil";

export const findBookingsByDate = (bookings, date, time) => {
  const timeId = time?.id;

  const matchingBookings = bookings?.filter((booking) => {
    const bookingDate = new Date(booking.date);
    return isEqualDateWithoutTime(bookingDate, date) && booking?.idTime === timeId;
  });

  // console.log("matchingBookings: ", matchingBookings);

  return matchingBookings?.length > 0 ? matchingBookings[0] : null;
};

export const groupSchedulesBySession = (schedules, currentDate) => {
  const schedulesGroupBySession = { morning: null, afternoon: null };

  schedules.forEach((schedule) => {
    const repeatOn = schedule?.repeatOn?.split(",").map(Number);
    const dayOfWeek = currentDate.getDay();

    if (repeatOn.includes(dayOfWeek))
      if (schedule?.session === scheduleSessions.MORNING) {
        schedulesGroupBySession.morning = schedule;
      } else if (schedule?.session === scheduleSessions.AFFTERNOON) {
        schedulesGroupBySession.afternoon = schedule;
      }
  });

  return schedulesGroupBySession;
};

export const isTimeOffAtThisScheduleTime = (timeOffs, colDate, time) => {
  const currentScheduleTimeStart = createDateByDateAndTimeStr(colDate, time.timeStart);
  const currentScheduleTimeEnd = createDateByDateAndTimeStr(colDate, time.timeEnd);

  return timeOffs?.some((timeOff) => {
    for (let date = new Date(timeOff?.from); date <= new Date(timeOff?.to); date.setDate(date.getDate() + 1)) {
      const timeOffStart = createDateByDateAndTimeStr(new Date(date), timeOff.timeStart);
      const timeOffEnd = createDateByDateAndTimeStr(new Date(date), timeOff.timeEnd);

      if (isBetweenAndNoEqual(currentScheduleTimeStart, timeOffStart, timeOffEnd)) {
        return true;
      }
      if (isBetweenAndNoEqual(currentScheduleTimeEnd, timeOffStart, timeOffEnd)) {
        return true;
      }
      if (isBetweenAndNoEqual(timeOffStart, currentScheduleTimeStart, currentScheduleTimeEnd)) {
        return true;
      }
      if (isBetweenAndNoEqual(timeOffEnd, currentScheduleTimeStart, currentScheduleTimeEnd)) {
        return true;
      }
    }
    return false;
  });
};
