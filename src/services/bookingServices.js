import camelcaseKeys from "camelcase-keys";
import { bookingApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";

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
  getBookingDetailById
};
