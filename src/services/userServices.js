import camelcaseKeys from "camelcase-keys";
import { userApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import { cleanUndefinedAndEmptyStrValueObject } from "../utils/objectUtil";

const getUserList = async ({ email, phoneNumber, name, page, limit, blocked, gender, address, healthInsurance }) => {
  // console.log("getUserList: ", { page, limit, name });

  const params = cleanUndefinedAndEmptyStrValueObject({
    email,
    phone_number: phoneNumber,
    name,
    page,
    limit,
    blocked,
    gender,
    address,
    healthInsurance
  });

  // console.log("params: ", params);

  try {
    const res = await axiosClient.get(userApi.userList(), { params });

    // let res = camelcaseKeys(
    //   {
    //     status: true,
    //     message: "",
    //     data: {
    //       users: userMockData.list()
    //     }
    //   },
    //   { deep: true }
    // );

    // console.log("res: ", res);

    if (res?.status) {
      const users = camelcaseKeys(res?.data?.results, { deep: true });
      const count = res?.data?.totalResults;

      return {
        success: true,
        users,
        count,

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
  getUserList
};
