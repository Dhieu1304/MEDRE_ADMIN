import camelcaseKeys from "camelcase-keys";
import scheduleMockData from "../mockData/scheduleMockData";
import { scheduleApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import { cleanUndefinedAndEmptyStrValueObject } from "../utils/objectUtil";

const getScheduleListByDoctorId = async (doctorId, from, to) => {
  // console.log({ from, to });

  const params = {
    id_doctor: doctorId,
    from,
    to
  };

  // console.log("params: ", params);
  try {
    const res = await axiosClient.get(scheduleApi.scheduleList(), {
      params
    });
    // const res = camelcaseKeys(scheduleMockData.list(), { deep: true });

    // console.log("res: ", res);

    if (res?.status) {
      const schedules = camelcaseKeys(res?.data, { deep: true });

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

const changeApplyTimeScheduleByScheduleIds = async (doctorId, { scheduleIds, applyFrom, applyTo }) => {
  // console.log("changeApplyTimeScheduleByScheduleIds: ", { scheduleIds, applyFrom, applyTo });

  const dataBody = cleanUndefinedAndEmptyStrValueObject({ doctorId, scheduleIds, applyFrom, applyTo });

  // do nothing
  Object.keys(dataBody).forEach(() => {});
};

const createSchedulesByDoctorId = async ({ doctorId, applyFrom, applyTo, data }) => {
  // console.log({ doctorId, applyFrom, applyTo, data });

  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    id_doctor: doctorId,
    apply_from: applyFrom,
    apply_to: applyTo,
    data: data.map((item) => ({
      day_of_week: item.dayOfWeek,
      id_time: item.timeId,
      type: item.type
    }))
  });

  // console.log("dataBody: ", dataBody);
  try {
    const res = await axiosClient.post(scheduleApi.createSchedule(), dataBody);
    // const res = camelcaseKeys(scheduleMockData.list(), { deep: true });

    // console.log("res: ", res);

    if (res?.status) {
      const schedules = camelcaseKeys(res?.data, { deep: true });

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

export default {
  getScheduleListByDoctorId,
  getTimeList,
  changeApplyTimeScheduleByScheduleIds,
  createSchedulesByDoctorId
};
