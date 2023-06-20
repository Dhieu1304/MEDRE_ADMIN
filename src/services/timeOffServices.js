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

    // console.log("res: ", res);

    if (res?.status) {
      const data = camelcaseKeys(res?.data, { deep: true });
      const timeOffs = data?.results;
      const count = data?.totalResults;

      // console.log("timeOffs in res: ", timeOffs);

      return {
        timeOffs,
        count,
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

const addNewTimeOff = async ({ from, to, session }) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    from,
    to,
    session
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
        timeOffs,
        count,
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

const editNewTimeOff = async ({ id, from, to, session }) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    id,
    from,
    to,
    session
  });

  // console.log("dataBody: ", dataBody);
  try {
    const res = await axiosClient.post(timeOffApi.editTimeOff(), dataBody);
    // const res = camelcaseKeys(scheduleMockData.list(), { deep: true });

    // console.log("res: ", res);

    if (res?.status) {
      return {
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

const deleteNewTimeOff = async (id) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    id
  });

  // console.log("dataBody: ", dataBody);
  try {
    const res = await axiosClient.post(timeOffApi.deleteTimeOff(), dataBody);
    // const res = camelcaseKeys(scheduleMockData.list(), { deep: true });

    // console.log("res: ", res);

    if (res?.status) {
      // console.log("timeOffs in res: ", timeOffs);

      return {
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

export default { getTimeOffByDoctorId, addNewTimeOff, editNewTimeOff, deleteNewTimeOff };
