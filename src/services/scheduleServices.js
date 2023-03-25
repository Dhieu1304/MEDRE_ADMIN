// import { userApi, scheduleApi } from "../config/apiConfig";
// import axiosClient from "../config/axiosClient";
import camelcaseKeys from "camelcase-keys";
import scheduleMockData from "../mockData/scheduleMockData";

const getScheduleList = async () => {
  try {
    // const res = await axiosClient.get(scheduleApi.scheduleList());
    const res = camelcaseKeys(
      {
        status: true,
        message: "",
        data: {
          schedules: scheduleMockData.list()
        }
      },
      { deep: true }
    );

    if (res?.status) {
      const schedules = res?.data?.schedules;

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
    // const res = await axiosClient.get(scheduleApi.scheduleList());
    const res = camelcaseKeys(
      {
        status: true,
        message: "",
        data: {
          times: scheduleMockData.times()
        }
      },
      { deep: true }
    );

    if (res?.status) {
      const times = res?.data?.times;

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

export default {
  getScheduleList,
  getTimeList
};
