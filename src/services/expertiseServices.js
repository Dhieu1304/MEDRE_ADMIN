import camelcaseKeys from "camelcase-keys";
import { expertiseApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import { cleanUndefinedAndEmptyStrValueObject } from "../utils/objectUtil";

const getExpertiseList = async () => {
  // console.log("params: ", params);
  try {
    const res = await axiosClient.get(expertiseApi.expertiseList());

    // console.log("res: ", res);
    if (res?.status) {
      const expertises = camelcaseKeys(res?.data, { deep: true });

      return {
        expertises,
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

const editExpertise = async ({ id, value }) => {
  try {
    const dataBody = cleanUndefinedAndEmptyStrValueObject({ id, value });
    // console.log("dataBody: ", dataBody);

    const res = await axiosClient.post(expertiseApi.editExpertise(), dataBody);

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

export default {
  getExpertiseList,
  editExpertise
};
