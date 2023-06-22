import camelcaseKeys from "camelcase-keys";
import { scheduleBookingTimeApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";

const getscheduleBookingTimeListByExpertiseIdAndTimeId = async ({ expertiseId, timeId }) => {
  // console.log({ from, to });

  const params = {
    id_expertise: expertiseId,
    id_time_schedule: timeId
  };

  // console.log("params: ", params);
  try {
    const res = await axiosClient.get(scheduleBookingTimeApi.scheduleBookingTimeList(), {
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

export default {
  getscheduleBookingTimeListByExpertiseIdAndTimeId
};
