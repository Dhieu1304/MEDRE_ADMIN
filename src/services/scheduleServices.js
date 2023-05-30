import camelcaseKeys from "camelcase-keys";
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
        schedules,
        success: true,
        message: res?.message,
        isMustLoginAgain: res?.isMustLoginAgain,
        statusCode: res?.statusCode
      };
    }
    return {
      success: false,
      message: res?.message || `Status is ${res.status}`,
      isMustLoginAgain: res?.isMustLoginAgain,
      statusCode: res?.statusCode
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
    const res = await axiosClient.get(scheduleApi.timeList());
    // const res = camelcaseKeys(scheduleMockData.time(), { deep: true });

    if (res?.status) {
      const times = camelcaseKeys(res?.data, { deep: true });

      return {
        times,
        success: true,
        message: res?.message,
        isMustLoginAgain: res?.isMustLoginAgain,
        statusCode: res?.statusCode
      };
    }
    return {
      success: false,
      message: res?.message || `Status is ${res.status}`,
      isMustLoginAgain: res?.isMustLoginAgain,
      statusCode: res?.statusCode
    };
  } catch (e) {
    // console.error(e.message);
    return {
      success: false,
      message: e.message
    };
  }
};

const changeApplyToScheduleByScheduleIds = async ({ scheduleIds, applyTo }) => {
  // console.log("changeApplyToScheduleByScheduleIds: ", { doctorId, scheduleIds, applyTo });

  const dataBody = cleanUndefinedAndEmptyStrValueObject({ id: scheduleIds, apply_to: applyTo });

  // console.log("dataBody: ", dataBody);

  try {
    const res = await axiosClient.post(scheduleApi.changeApplyTo(), dataBody);
    // const res = camelcaseKeys(scheduleMockData.list(), { deep: true });

    // console.log("res: ", res);

    if (res?.status) {
      const schedules = camelcaseKeys(res?.data, { deep: true });

      return {
        schedules,
        success: true,
        message: res?.message,
        isMustLoginAgain: res?.isMustLoginAgain,
        statusCode: res?.statusCode
      };
    }
    return {
      success: false,
      message: res?.message || `Status is ${res.status}`,
      isMustLoginAgain: res?.isMustLoginAgain,
      statusCode: res?.statusCode
    };
  } catch (e) {
    // console.error(e.message);
    return {
      success: false,
      message: e.message
    };
  }
};

const createSchedulesByDoctorId = async ({ doctorId, applyFrom, applyTo, data }) => {
  // console.log({ doctorId, applyFrom, applyTo, data });

  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    id_doctor: doctorId,
    apply_from: applyFrom,
    apply_to: applyTo,
    data: data.map((item) => ({
      id_expertise: item.expertise,
      type: item.type,
      session: item.session,
      repeat_on: item.repeatOn.sort()
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
        schedules,
        success: true,
        message: res?.message,
        isMustLoginAgain: res?.isMustLoginAgain,
        statusCode: res?.statusCode
      };
    }
    return {
      success: false,
      message: res?.message || `Status is ${res.status}`,
      isMustLoginAgain: res?.isMustLoginAgain,
      statusCode: res?.statusCode
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
  changeApplyToScheduleByScheduleIds,
  createSchedulesByDoctorId
};
