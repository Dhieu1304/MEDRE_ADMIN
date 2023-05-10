import { scheduleSessions } from "../../../entities/Schedule";
import { isBetweenOrEqualWithoutTime, isEqualDateWithoutTime } from "../../../utils/datetimeUtil";

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
  const schedulesGroupBySession = { morning: null, afternoon: null, wholeDay: null };

  schedules.forEach((schedule) => {
    const repeatOn = schedule?.repeatOn?.split(",").map(Number);
    const dayOfWeek = currentDate.getDay();

    if (repeatOn.includes(dayOfWeek))
      if (schedule?.session === scheduleSessions.MORNING) {
        schedulesGroupBySession.morning = schedule;
      } else if (schedule?.session === scheduleSessions.AFFTERNOON) {
        schedulesGroupBySession.afternoon = schedule;
      } else if (schedule?.session === scheduleSessions.WHOLE_DAY) {
        schedulesGroupBySession.wholeDay = schedule;
      }
  });

  return schedulesGroupBySession;
};

// export const groupSchedulesDayOfWeekAndSession = (schedules) => {
//   const schedulesGroupByDayOfWeekAndSession = Array.from({ length: 7 }, () => ({
//     morning: null,
//     afternoon: null,
//     wholeDay: null
//   }));

//   schedules.forEach((schedule) => {
//     const repeatOn = schedule?.repeatOn?.split(",").map(Number);
//     repeatOn.forEach((dayOfWeek) => {
//       if (Number.isInteger(dayOfWeek) && dayOfWeek >= 0 && dayOfWeek <= 6) {
//         if (schedule?.session === scheduleSessions.MORNING) {
//           schedulesGroupByDayOfWeekAndSession[dayOfWeek].morning = schedule;
//         } else if (schedule?.session === scheduleSessions.AFFTERNOON) {
//           schedulesGroupByDayOfWeekAndSession[dayOfWeek].afternoon = schedule;
//         } else if (schedule?.session === scheduleSessions.WHOLE_DAY) {
//           schedulesGroupByDayOfWeekAndSession[dayOfWeek].wholeDay = schedule;
//         }
//       }
//     });
//   });

//   return schedulesGroupByDayOfWeekAndSession;
// };

export const isTimeOffAtThisScheduleTime = (timeOffs, colDate, time) => {
  return timeOffs?.some((timeOff) => {
    if (isBetweenOrEqualWithoutTime(colDate, new Date(timeOff?.from), new Date(timeOff?.to))) {
      if (timeOff?.session === scheduleSessions.WHOLE_DAY) return true;

      return timeOff?.session === time?.session;
    }

    return false;
  });
};
