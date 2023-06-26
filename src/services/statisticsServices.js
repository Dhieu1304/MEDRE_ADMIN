import { statisticsApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import { cleanUndefinedAndEmptyStrValueObject } from "../utils/objectUtil";

const getStatisticsByBooking = async ({ time }) => {
  const params = cleanUndefinedAndEmptyStrValueObject({
    time
  });

  //   console.log("params: ", params);

  try {
    const res = await axiosClient.get(statisticsApi.booking(), {
      params
    });

    // console.log("res: ", res);

    if (res?.status) {
      return {
        data: res?.data,
        success: true,
        message: res?.message,
        isMustLoginAgain: res?.isMustLoginAgain,
        statusCode: res?.statusCode
      };
    }
    return {
      success: false,
      message: res?.message,
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
  getStatisticsByBooking
};
