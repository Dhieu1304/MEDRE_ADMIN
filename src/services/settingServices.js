import camelcaseKeys from "camelcase-keys";
import { settingApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
// import { cleanUndefinedAndEmptyStrValueObject } from "../utils/objectUtil";

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

// const getPatientDetail = async (id) => {
//   try {
//     // console.log("id: ", id);

//     const res = await axiosClient.get(settingApi.patientDetail(id));

//     // console.log("res: ", res);

//     if (res?.status) {
//       const patient = camelcaseKeys(res?.data, { deep: true });

//       return {
//         success: true,
//         patient,
//         message: res?.message
//       };
//     }
//     return {
//       success: false,
//       message: res?.message || `Status is ${res.status}`
//     };
//   } catch (e) {
//     // console.error(e.message);
//     return {
//       success: false,
//       message: e.message
//     };
//   }
// };

export default {
  getSettingList
};
