import camelcaseKeys from "camelcase-keys";
import { bookingApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import { cleanUndefinedAndEmptyStrValueObject } from "../utils/objectUtil";

const book = async ({ scheduleId, timeId, date, reason, patientId }) => {
  // console.log({ from, to });

  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    id_schedule: scheduleId,
    id_time: timeId,
    date,
    reason,
    id_patient: patientId
  });

  // console.log("dataBody: ", dataBody);
  try {
    const res = await axiosClient.post(bookingApi.book(), dataBody);
    // console.log("res: ", res);

    if (res?.status) {
      const booking = camelcaseKeys(res?.data, { deep: true });

      return {
        success: true,
        booking,
        message: res?.message
      };
    }
    return {
      success: false,
      message: res?.message || `Status is ${res.status}`
    };
  } catch (e) {
    // console.error(e.message);
    return {
      success: false,
      message: e.message
    };
  }
};

const getBookingDetailById = async (id) => {
  try {
    const res = await axiosClient.get(bookingApi.bookingDetail(id));
    // const res = camelcaseKeys(scheduleMockData.list(), { deep: true });

    // console.log("res: ", res);

    if (res?.status) {
      const booking = camelcaseKeys(res?.data, { deep: true });

      return {
        success: true,
        booking,
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
  book,
  getBookingDetailById
};
