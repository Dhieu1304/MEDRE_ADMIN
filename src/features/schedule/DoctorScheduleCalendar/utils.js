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

export const groupSchedulesDayOfWeekAndSession = (schedules) => {
  const schedulesGroupByDayOfWeekAndSession = Array.from({ length: 7 }, () => ({ morning: null, afternoon: null }));

  schedules.forEach((schedule) => {
    const repeatOn = schedule?.repeatOn?.split(",").map(Number);
    repeatOn.forEach((dayOfWeek) => {
      if (Number.isInteger(dayOfWeek) && dayOfWeek >= 0 && dayOfWeek <= 6) {
        if (schedule?.session === scheduleSessions.MORNING) {
          schedulesGroupByDayOfWeekAndSession[dayOfWeek].morning = schedule;
        } else if (schedule?.session === scheduleSessions.AFFTERNOON) {
          schedulesGroupByDayOfWeekAndSession[dayOfWeek].afternoon = schedule;
        }
      }
    });
  });

  return schedulesGroupByDayOfWeekAndSession;
};

export const getSessionByTimeStart = (timeStart) => {
  if (timeStart <= "11:30:00") {
    return scheduleSessions.MORNING;
  }
  return scheduleSessions.AFFTERNOON;
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

// export const findBookingsByDate = (bookings, date) => {
//   const matchingBookings = bookings?.filter((booking) => {
//     const bookingDate = new Date(booking.date);
//     return isEqualDateWithoutTime(bookingDate, date);
//   });

//   return matchingBookings?.length > 0 ? matchingBookings[0] : null;
// };

// export const groupSchedulesByTimeId = (schedules, timesList, heads, timeOffs) => {
//   console.log("time: ", timesList);
//   console.log("schedules: ", schedules);
//   console.log("timeOffs: ", timeOffs);

//   const timeIds = timesList?.map((time) => time?.id);
//   const schedulesByTimeId = {};

//   const schedulesTimeOff = {};

// const scheduleGroupBDayOfWeekAndSession = Array.from({length: 7}, () => ({morning: [], afternoon: []}));

//   schedules.forEach((schedule) => {

//       const repeatOn = schedule?.repeatOn?.split(",").map(Number);
//       repeatOn.forEach((dayOfWeek) => {

//         if(Number.isInteger(num) && num >= 0 && num <= 6) {
//           return true;
//           if(schedule?.session === scheduleSessions.MORNING) {

//             scheduleGroupBySessionAndDayOfWeek[dayOfWeek].m = schedule;
//           }
//    else if(schedule?.session === scheduleSessions.AFFTERNOON) {
//    }
//         }

//       })

//   })

//   // schedules.forEach((schedule) => {
//   //   if (timeIds.includes(schedule.idTime)) {
//   //     const { dayOfWeek } = schedule;
//   //     const head = heads[dayOfWeek];

//   //     const applyFrom = new Date(schedule.applyFrom);
//   //     const applyTo = new Date(schedule.applyTo);
//   //     applyTo.setDate(applyTo.getDate() + 1);

//   //     const currentScheduleTimeStart = createDateByDateAndTimeStr(head, schedule.timeSchedule.timeStart);
//   //     const currentScheduleTimeEnd = createDateByDateAndTimeStr(head, schedule.timeSchedule.timeEnd);

//   //     let isTimeOff = false;
//   //     timeOffs.forEach((timeOff) => {
//   //       const timeOffStart = createDateByDateAndTimeStr(new Date(timeOff.date), timeOff.timeStart);
//   //       const timeOffEnd = createDateByDateAndTimeStr(new Date(timeOff.date), timeOff.timeEnd);

//   //       if (isBetweenAndNoEqual(currentScheduleTimeStart, timeOffStart, timeOffEnd)) {
//   //         isTimeOff = true;
//   //       } else if (isBetweenAndNoEqual(currentScheduleTimeEnd, timeOffStart, timeOffEnd)) {
//   //         isTimeOff = true;
//   //       } else if (isBetweenAndNoEqual(timeOffStart, currentScheduleTimeStart, currentScheduleTimeEnd)) {
//   //         isTimeOff = true;
//   //       } else if (isBetweenAndNoEqual(timeOffEnd, currentScheduleTimeStart, currentScheduleTimeEnd)) {
//   //         isTimeOff = true;
//   //       }
//   //     });

//   //     if (isTimeOff) {
//   //       schedulesTimeOff[schedule.id] = true;
//   //     }

//   //     // console.log("schedule: ", schedule);

//   //     if (head >= applyFrom && head <= applyTo) {
//   //       // console.log("push:");
//   //       if (!schedulesByTimeId[schedule.idTime]) {
//   //         schedulesByTimeId[schedule.idTime] = [];
//   //       }
//   //       schedulesByTimeId[schedule.idTime].push({
//   //         ...schedule
//   //         // isTimeOff
//   //       });
//   //     }
//   //   }
//   // });

//   // return [
//   //   timeIds.map((timeId) => {
//   //     if (schedulesByTimeId[timeId]) {
//   //       return schedulesByTimeId[timeId].sort((a, b) => a.day_of_week - b.day_of_week);
//   //     }
//   //     return [];
//   //   }),
//   //   schedulesTimeOff
//   // ];
// };
