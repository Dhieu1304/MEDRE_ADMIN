import camelcaseKeys from "camelcase-keys";
// import { scheduleApi } from "../config/apiConfig";
// import axiosClient from "../config/axiosClient";
import formatDate from "date-and-time";
import scheduleMockData from "../mockData/scheduleMockData";

const getScheduleListByDoctorId = async (from = new Date(), to = new Date()) => {
  // console.log({ from, to });
  from.setHours(0);
  from.setMinutes(0);
  from.setSeconds(0);

  to.setHours(0);
  to.setMinutes(0);
  to.setSeconds(0);

  try {
    // const res = await axiosClient.get(scheduleApi.scheduleList());
    const res = camelcaseKeys(scheduleMockData.list(), { deep: true });

    if (res?.status) {
      const schedulesAll = camelcaseKeys(res?.data, { deep: true });

      const schedules = schedulesAll?.filter((schedule) => {
        const date = new Date(schedule?.date);
        // const a = formatDate.subtract(date, from).toDays();
        // const b = formatDate.subtract(date, to).toDays();
        // console.log("date: ", date);
        // console.log("a: ", a);
        // console.log("b: ", b);

        const leftCondition = formatDate.subtract(date, from).toDays() >= 0 || formatDate.isSameDay(date, from);
        const rightCondition = formatDate.subtract(date, to).toDays() <= 0 || formatDate.isSameDay(date, from);

        if (leftCondition && rightCondition) {
          // console.log("true");
          return true;
        }
        return false;
      });

      // console.log("schedules: ", schedules);

      return {
        success: true,
        schedules,
        message: res?.message
      };
    }
    return {
      success: false,
      message: `Status is ${res.status}`
    };
  } catch (e) {
    // console.error(e.message);
    return {
      success: false,
      message: e.message
    };
  }
};

const getTimeList = async () => {
  try {
    // const res = await axiosClient.get(scheduleApi.timeList());
    const res = camelcaseKeys(scheduleMockData.time(), { deep: true });

    if (res?.status) {
      const times = camelcaseKeys(res?.data, { deep: true });

      return {
        success: true,
        times,
        message: res?.message
      };
    }
    return {
      success: false,
      message: `Status is ${res.status}`
    };
  } catch (e) {
    // console.error(e.message);
    return {
      success: false,
      message: e.message
    };
  }
};

const getAllScheduleList = async (from = new Date(), to = new Date()) => {
  // console.log({ from, to });
  from.setHours(0);
  from.setMinutes(0);
  from.setSeconds(0);

  to.setHours(0);
  to.setMinutes(0);
  to.setSeconds(0);

  try {
    // const res = await axiosClient.get(scheduleApi.scheduleList());
    const res = camelcaseKeys(scheduleMockData.all(), { deep: true });

    if (res?.status) {
      const schedulesAll = camelcaseKeys(scheduleMockData.list()?.data, { deep: true });

      const schedules = schedulesAll?.filter((schedule) => {
        const date = new Date(schedule?.date);
        // const a = formatDate.subtract(date, from).toDays();
        // const b = formatDate.subtract(date, to).toDays();
        // console.log("date: ", date);
        // console.log("a: ", a);
        // console.log("b: ", b);

        const leftCondition = formatDate.subtract(date, from).toDays() >= 0 || formatDate.isSameDay(date, from);
        const rightCondition = formatDate.subtract(date, to).toDays() <= 0 || formatDate.isSameDay(date, from);

        if (leftCondition && rightCondition) {
          // console.log("true");
          return true;
        }
        return false;
      });

      // console.log("schedules: ", schedules);

      const doctors = res.data?.results.map((doctor) => {
        return {
          ...doctor,
          schedules
        };
      });

      // console.log("schedules: ", schedules);
      // console.log("doctors: ", doctors);

      return {
        success: true,
        doctors,
        message: res?.message
      };
    }
    return {
      success: false,
      message: `Status is ${res.status}`
    };
  } catch (e) {
    // console.error(e.message);
    return {
      success: false,
      message: e.message
    };
  }
};

export default {
  getScheduleListByDoctorId,
  getTimeList,
  getAllScheduleList
};
