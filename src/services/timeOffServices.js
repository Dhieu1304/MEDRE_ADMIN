import camelcaseKeys from "camelcase-keys";
import { timeOffApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import { cleanUndefinedAndEmptyStrValueObject } from "../utils/objectUtil";

const getTimeOffByDoctorId = async (doctorId, { from, to, page, limit }) => {
  // console.log({ from, to });

  const params = {
    id_doctor: doctorId,
    from,
    to,
    page,
    limit
  };

  // console.log("params: ", params);
  try {
    const res = await axiosClient.get(timeOffApi.timeOffList(), {
      params
    });
    // const res = camelcaseKeys(scheduleMockData.list(), { deep: true });

    // console.log("res    xxx: ", res);

    if (res?.status) {
      const data = camelcaseKeys(res?.data, { deep: true });
      const timeOffs = data?.results;
      const count = data?.totalResults;

      // console.log("timeOffs in res: ", timeOffs);

      return {
        success: true,
        timeOffs,
        count,
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

const addNewTimeOff = async ({ from, to, timeStart, timeEnd }) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    from,
    to,
    time_start: timeStart,
    time_end: timeEnd
  });

  // console.log("dataBody: ", dataBody);
  try {
    const res = await axiosClient.post(timeOffApi.createTimeOff(), dataBody);
    // const res = camelcaseKeys(scheduleMockData.list(), { deep: true });

    // console.log("res: ", res);

    if (res?.status) {
      const data = camelcaseKeys(res?.data, { deep: true });
      const timeOffs = data?.results;
      const count = data?.totalResults;

      // console.log("timeOffs in res: ", timeOffs);

      return {
        success: true,
        timeOffs,
        count,
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

export default { getTimeOffByDoctorId, addNewTimeOff };
