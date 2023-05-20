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

const getUserDetail = async (id) => {
  try {
    const res = await axiosClient.get(userApi.userDetail(id));

    // const res = camelcaseKeys(
    //   {
    //     status: true,
    //     message: "",
    //     data: {
    //       user: userMockData.detail(id)
    //     }
    //   },
    //   { deep: true }
    // );

    if (res?.status) {
      const user = camelcaseKeys(res?.data, { deep: true });

      return {
        success: true,
        user,
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

const editUserInfo = async ({ name, address, gender, dob }) => {
  try {
    const res = await axiosClient.get(userApi.editUser(), {
      name,
      address,
      gender,
      dob
    });

    // console.log("editUserInfo res: ", res);

    if (res?.status) {
      const user = camelcaseKeys(res?.data?.user, { deep: true });

      return {
        success: true,
        user,
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

const blockUser = async (id, reason) => {
  try {
    // console.log("blockUser: ", { id, reason });
    const res = await axiosClient.post(userApi.blockUser(), {
      id_account: id,
      reason
    });

    // console.log("res: ", res);

    if (res?.status) {
      const user = camelcaseKeys(res?.data?.user, { deep: true });

      return {
        success: true,
        user,
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

const unblockUser = async (id, reason) => {
  try {
    // console.log("unblockUser: ", { id, reason });
    const res = await axiosClient.post(userApi.unblockUser(), {
      id_account: id,
      reason
    });

    // console.log("res: ", res);

    if (res?.status) {
      const user = camelcaseKeys(res?.data?.user, { deep: true });

      return {
        success: true,
        user,
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
  getUserList,
  getUserDetail,
  editUserInfo,
  blockUser,
  unblockUser
};
