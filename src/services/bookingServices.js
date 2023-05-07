import camelcaseKeys from "camelcase-keys";
import { bookingApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import { cleanUndefinedAndEmptyStrValueObject } from "../utils/objectUtil";

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

  console.log("params: ", params);
  try {
    const res = await axiosClient.get(bookingApi.bookingList(), {
      params
    });
    console.log("res: ", res);

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

export default {
  getBookingList,
  getBookingDetail
};
