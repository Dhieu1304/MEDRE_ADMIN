import { authApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import localStorageUtil from "../utils/localStorageUtil";

const loginByEmail = async (email, password) => {
  try {
    const res = await axiosClient.post(authApi.loginByEmail, { email, password });

    if (res?.status) {
      const staff = res?.data?.staff;
      const tokens = res?.data?.tokens;

      localStorageUtil.setItem(localStorageUtil.LOCAL_STORAGE.ACCESS_TOKEN, tokens?.access?.token);
      localStorageUtil.setItem(localStorageUtil.LOCAL_STORAGE.REFRESH_TOKEN, tokens?.refresh?.token);

      localStorageUtil.setItem(localStorageUtil.LOCAL_STORAGE.ACCESS_TOKEN_EXPIRE_TIME, tokens?.access?.expires);
      localStorageUtil.setItem(localStorageUtil.LOCAL_STORAGE.REFRESH_TOKEN_EXPIRE_TIME, tokens?.refresh?.expires);

      return {
        success: true,
        staff,
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

const logout = async () => {
  localStorageUtil.removeItem(localStorageUtil.LOCAL_STORAGE.ACCESS_TOKEN);
  localStorageUtil.removeItem(localStorageUtil.LOCAL_STORAGE.REFRESH_TOKEN);
  localStorageUtil.removeItem(localStorageUtil.LOCAL_STORAGE.ACCESS_TOKEN_EXPIRE_TIME);
  localStorageUtil.removeItem(localStorageUtil.LOCAL_STORAGE.REFRESH_TOKEN_EXPIRE_TIME);

  return {
    success: true,
    message: "Logout successfully"
  };
};

export default {
  loginByEmail,
  logout
};
