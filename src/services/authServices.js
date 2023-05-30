import { authApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import patternConfig from "../config/patternConfig";
// import localStorageUtil from "../utils/localStorageUtil";
import { clearToken, saveToken } from "../utils/tokenUtils";

const login = async (emailOrUsernameOrPhoneNumber, password) => {
  try {
    let res;
    if (patternConfig.phonePattern.test(emailOrUsernameOrPhoneNumber)) {
      const phoneNumber = emailOrUsernameOrPhoneNumber;
      // console.log("phoneNumber: ", phoneNumber);
      res = await axiosClient.post(authApi.loginByPhoneNumber(), { phone_number: phoneNumber, password });
    } else if (patternConfig.emailPattern.test(emailOrUsernameOrPhoneNumber)) {
      const email = emailOrUsernameOrPhoneNumber;
      // console.log("email: ", email);
      res = await axiosClient.post(authApi.loginByEmail(), { email, password });
    } else {
      const username = emailOrUsernameOrPhoneNumber;
      // console.log("username: ", username);
      res = await axiosClient.post(authApi.loginByUsername(), { username, password });
    }

    // console.log("res: ", res);

    if (res?.status) {
      const staff = res?.data?.staff;
      const tokens = res?.data?.tokens;

      // localStorageUtil.setItem(localStorageUtil.LOCAL_STORAGE.ACCESS_TOKEN, tokens?.access?.token);
      // localStorageUtil.setItem(localStorageUtil.LOCAL_STORAGE.REFRESH_TOKEN, tokens?.refresh?.token);

      // localStorageUtil.setItem(localStorageUtil.LOCAL_STORAGE.ACCESS_TOKEN_EXPIRE_TIME, tokens?.access?.expires);
      // localStorageUtil.setItem(localStorageUtil.LOCAL_STORAGE.REFRESH_TOKEN_EXPIRE_TIME, tokens?.refresh?.expires);

      saveToken(tokens);

      return {
        staff,
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

const logout = async () => {
  // localStorageUtil.removeItem(localStorageUtil.LOCAL_STORAGE.ACCESS_TOKEN);
  // localStorageUtil.removeItem(localStorageUtil.LOCAL_STORAGE.REFRESH_TOKEN);
  // localStorageUtil.removeItem(localStorageUtil.LOCAL_STORAGE.ACCESS_TOKEN_EXPIRE_TIME);
  // localStorageUtil.removeItem(localStorageUtil.LOCAL_STORAGE.REFRESH_TOKEN_EXPIRE_TIME);

  clearToken();

  return {
    success: true,
    message: "Logout successfully"
  };
};

export default {
  login,
  logout
};
