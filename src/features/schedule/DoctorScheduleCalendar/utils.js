import { createDateByDateAndTimeStr, isBetweenAndNoEqual, isEqualDateWithoutTime } from "../../../utils/datetimeUtil";

export const findBookingsByDate = (bookings, date) => {
  const matchingBookings = bookings?.filter((booking) => {
    const bookingDate = new Date(booking.date);
    return isEqualDateWithoutTime(bookingDate, date);
  });

  return matchingBookings?.length > 0 ? matchingBookings[0] : null;
};

export const groupSchedulesByTimeId = (schedules, timesList, heads, timeOffs) => {
  const timeIds = timesList?.map((time) => time?.id);
  const schedulesByTimeId = {};

  const schedulesTimeOff = {};

  schedules.forEach((schedule) => {
    if (timeIds.includes(schedule.idTime)) {
      const { dayOfWeek } = schedule;
      const head = heads[dayOfWeek];

      const applyFrom = new Date(schedule.applyFrom);
      const applyTo = new Date(schedule.applyTo);
      applyTo.setDate(applyTo.getDate() + 1);

      const currentScheduleTimeStart = createDateByDateAndTimeStr(head, schedule.timeSchedule.timeStart);
      const currentScheduleTimeEnd = createDateByDateAndTimeStr(head, schedule.timeSchedule.timeEnd);

      let isTimeOff = false;
      timeOffs.forEach((timeOff) => {
        const timeOffStart = createDateByDateAndTimeStr(new Date(timeOff.date), timeOff.timeStart);
        const timeOffEnd = createDateByDateAndTimeStr(new Date(timeOff.date), timeOff.timeEnd);

        if (isBetweenAndNoEqual(currentScheduleTimeStart, timeOffStart, timeOffEnd)) {
          isTimeOff = true;
        } else if (isBetweenAndNoEqual(currentScheduleTimeEnd, timeOffStart, timeOffEnd)) {
          isTimeOff = true;
        } else if (isBetweenAndNoEqual(timeOffStart, currentScheduleTimeStart, currentScheduleTimeEnd)) {
          isTimeOff = true;
        } else if (isBetweenAndNoEqual(timeOffEnd, currentScheduleTimeStart, currentScheduleTimeEnd)) {
          isTimeOff = true;
        }
      });

      if (isTimeOff) {
        schedulesTimeOff[schedule.id] = true;
      }

      // console.log("schedule: ", schedule);

      if (head >= applyFrom && head <= applyTo) {
        // console.log("push:");
        if (!schedulesByTimeId[schedule.idTime]) {
          schedulesByTimeId[schedule.idTime] = [];
        }
        schedulesByTimeId[schedule.idTime].push({
          ...schedule
          // isTimeOff
        });
      }
    }
  });

  return [
    timeIds.map((timeId) => {
      if (schedulesByTimeId[timeId]) {
        return schedulesByTimeId[timeId].sort((a, b) => a.day_of_week - b.day_of_week);
      }
      return [];
    }),
    schedulesTimeOff
  ];
};
