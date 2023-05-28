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

const getBookingList = async ({ type, bookingStatus, from, to, isPayment, order, page, limit } = {}) => {
  const params = cleanUndefinedAndEmptyStrValueObject({
    type,
    booking_status: bookingStatus,
    from,
    to,
    is_payment: isPayment,
    order,
    page,
    limit
  });

  // console.log("params: ", params);
  try {
    const res = await axiosClient.get(bookingApi.bookingList(), {
      params
    });
    // console.log("res: ", res);

    if (res?.status) {
      const bookings = camelcaseKeys(res?.data?.results, { deep: true });
      const count = camelcaseKeys(res?.data?.totalResults, { deep: true });

      return {
        bookings,
        count,
        success: true,
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

const getBookingDetail = async (id) => {
  try {
    const res = await axiosClient.get(bookingApi.bookingDetail(id));

    if (res?.status) {
      // const booking = camelcaseKeys(res?.data, { deep: true });
      const booking = res?.data;

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

const updateBooking = async (note) => {
  try {
    const res = await axiosClient.post(bookingApi.updateBooking, { note });
    // console.log("Update");
    if (res?.status) {
      // const booking = camelcaseKeys(res?.data, { deep: true });
      const booking = res?.data;

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
  getBookingDetailById,
  getBookingList,
  getBookingDetail,
  updateBooking
};
