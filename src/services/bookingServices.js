import camelcaseKeys from "camelcase-keys";
import { bookingApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import { cleanUndefinedAndEmptyStrValueObject } from "../utils/objectUtil";

const book = async ({ scheduleId, timeId, date, reason, patientId, userId }) => {
  // console.log({ from, to });

  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    id_schedule: scheduleId,
    id_time: timeId,
    date,
    reason,
    id_patient: patientId,
    id_user: userId
  });

  // console.log("dataBody: ", dataBody);
  try {
    const res = await axiosClient.post(bookingApi.book(), dataBody);
    // console.log("res: ", res);

    if (res?.status) {
      const booking = camelcaseKeys(res?.data, { deep: true });

      return {
        booking,
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

const getBookingDetailById = async (id) => {
  try {
    const res = await axiosClient.get(bookingApi.bookingDetail(id));
    // const res = camelcaseKeys(scheduleMockData.list(), { deep: true });

    // console.log("res: ", res);

    if (res?.status) {
      const booking = camelcaseKeys(res?.data, { deep: true });

      return {
        booking,
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

const getBookingList = async ({
  patientPhoneNumber,
  userId,
  patientId,
  doctorId,
  staffBookingId,
  staffCancelId,
  type,
  isPayment,
  from,
  to,
  bookingStatuses,
  page,
  limit,
  order
} = {}) => {
  const params = cleanUndefinedAndEmptyStrValueObject({
    patient_phone_number: patientPhoneNumber,
    id_user: userId,
    id_patient: patientId,
    id_staff_booking: doctorId,
    id_staff_cancel: staffBookingId,
    id_doctor: staffCancelId,
    type,
    is_payment: isPayment,
    from,
    to,
    booking_status: bookingStatuses,
    page,
    limit,
    order
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

const getBookingDetail = async (id) => {
  try {
    const res = await axiosClient.get(bookingApi.bookingDetail(id));

    if (res?.status) {
      const booking = camelcaseKeys(res?.data, { deep: true });

      return {
        booking,
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

const updateBooking = async ({ id, isPayment, bookingStatus }) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    id,
    is_payment: isPayment,
    booking_status: bookingStatus
  });
  // console.log("dataBody: ", dataBody);
  try {
    const res = await axiosClient.post(bookingApi.updateBooking(), dataBody);
    // console.log("res: ", res);
    if (res?.status) {
      const booking = res?.data;

      return {
        booking,
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

const updateBookingByDoctor = async ({ id, prescription, conclusion, note }) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    id,
    prescription,
    conclusion,
    note
  });

  // console.log("dataBody: ", dataBody);

  // console.log("dataBody?.note: ", dataBody?.note);

  try {
    const res = await axiosClient.post(bookingApi.updateBookingByDoctor(), dataBody);
    // console.log("res: ", res);
    if (res?.status) {
      // const booking = camelcaseKeys(res?.data, { deep: true });
      const booking = res?.data;

      return {
        booking,
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

const getCountBookingSchedule = async ({ expertiseIds, doctorId, from, to, bookingMethod }) => {
  const params = cleanUndefinedAndEmptyStrValueObject({
    id_expertise: expertiseIds,
    id_doctor: doctorId,
    from,
    to,
    bookingMethod
  });

  // console.log("params: ", params);

  try {
    const res = await axiosClient.get(bookingApi.getCountBookingSchedule(), {
      params
    });
    // console.log("res: ", res);
    if (res?.status) {
      const bookingSchedules = camelcaseKeys(res?.data, { deep: true });

      return {
        bookingSchedules,
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

const getCountBookingScheduleByManyStaff = async ({ expertiseIds, doctorIds, from, to, bookingMethod }) => {
  const params = cleanUndefinedAndEmptyStrValueObject({
    id_expertise: expertiseIds,
    id_doctor: doctorIds,
    from,
    to,
    bookingMethod
  });

  // console.log("params: ", params);

  try {
    const res = await axiosClient.get(bookingApi.getCountBookingScheduleByManyStaff(), {
      params
    });
    // console.log("res: ", res);
    if (res?.status) {
      const bookingSchedules = camelcaseKeys(res?.data, { deep: true });

      return {
        bookingSchedules,
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
  book,
  getBookingDetailById,
  getBookingList,
  getBookingDetail,
  updateBooking,
  updateBookingByDoctor,
  getCountBookingSchedule,
  getCountBookingScheduleByManyStaff
};
