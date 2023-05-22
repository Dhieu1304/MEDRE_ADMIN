import camelcaseKeys from "camelcase-keys";
import { settingApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import { cleanUndefinedAndEmptyStrValueObject } from "../utils/objectUtil";

const getSettingList = async () => {
  // console.log("params: ", params);
  try {
    const res = await axiosClient.get(settingApi.settingList());

    // console.log("res: ", res);
    if (res?.status) {
      const settings = camelcaseKeys(res?.data, { deep: true });

      return {
        success: true,
        settings,
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

const editSetting = async ({ id, value }) => {
  try {
    const dataBody = cleanUndefinedAndEmptyStrValueObject({ id, value });
    // console.log("dataBody: ", dataBody);

    const res = await axiosClient.post(settingApi.editSetting(), dataBody);

    // console.log("res: ", res);

    if (res?.status) {
      return {
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

export default {
  getSettingList,
  editSetting
};
