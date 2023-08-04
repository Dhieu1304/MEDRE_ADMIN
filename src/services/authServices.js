import { authApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import patternConfig from "../config/patternConfig";
import { cleanUndefinedAndEmptyStrValueObject } from "../utils/objectUtil";
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

const sendVerificationToEmail = async (email) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    email,
    type: 2
  });

  // console.log("dataBody: ", dataBody);

  try {
    const res = await axiosClient.post(authApi.sendVerificationToEmail(), dataBody);

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

const sendResetPasswordToEmail = async (email) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    email,
    type: 2
  });

  // console.log("dataBody: ", dataBody);

  try {
    const res = await axiosClient.post(authApi.sendResetPasswordToEmail(), dataBody);

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

const sendVerificationOtpToPhone = async () => {
  // const dataBody = cleanUndefinedAndEmptyStrValueObject({
  //   phone_number: phoneNumber
  // });
  // console.log("dataBody: ", dataBody);
  // try {
  //   const res = await axiosClient.post(authApi.sendVerificationOtpToPhone(), dataBody);
  //   console.log("res: ", res);
  //   if (res?.status) {
  //     return {
  //       success: true,
  //       message: res?.message,
  //       ...res
  //     };
  //   }
  //   return {
  //     success: false,
  //     message: res?.message,
  //       ...res
  //   };
  // } catch (e) {
  //   // console.error(e.message);
  //   return {
  //     success: false,
  //     message: e.message
  //   };
  // }

  return {
    success: true,
    message: ""
  };
};

const sendResetPasswordOtpToPhone = async () => {
  // const dataBody = cleanUndefinedAndEmptyStrValueObject({
  //   phone_number: phoneNumber
  // });
  // console.log("dataBody: ", dataBody);
  // try {
  //   const res = await axiosClient.post(authApi.sendResetPasswordOtpToPhone(), dataBody);
  //   console.log("res: ", res);
  //   if (res?.status) {
  //     return {
  //       success: true,
  //       message: res?.message,
  //       ...res
  //     };
  //   }
  //   return {
  //     success: false,
  //     message: res?.message,
  //       ...res
  //   };
  // } catch (e) {
  //   // console.error(e.message);
  //   return {
  //     success: false,
  //     message: e.message
  //   };
  // }

  return {
    success: true,
    message: ""
  };
};

const verifyOtpToVerfifyPhoneNumber = async (phoneNumber) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    phone_number: phoneNumber,
    type: 2
  });

  try {
    await axiosClient.post(authApi.verifyOtpToVerfifyPhoneNumber(), dataBody);

    return {
      success: true,
      message: ""
    };

    // if (res?.status) {
    //   return {
    //     success: true,
    //     message: res?.message,
    //     ...res
    //   };
    // }
    // return {
    //   success: false,
    //   message: res?.message,
    //   ...res
    // };
  } catch (e) {
    // console.error(e.message);
    return {
      success: false,
      message: e.message
    };
  }
};

const verifyOtpToResetPasswordPhoneNumber = async () => {
  // const dataBody = cleanUndefinedAndEmptyStrValueObject({
  //   otp
  // });
  // console.log("dataBody: ", dataBody);
  // try {
  //   const res = await axiosClient.post(authApi.verifyOtpToResetPasswordPhoneNumber(), dataBody);
  //   console.log("res: ", res);
  //   if (res?.status) {
  //     return {
  //       success: true,
  //       message: res?.message,
  //       ...res
  //     };
  //   }
  //   return {
  //     success: false,
  //     message: res?.message,
  //       ...res
  //   };
  // } catch (e) {
  //   // console.error(e.message);
  //   return {
  //     success: false,
  //     message: e.message
  //   };
  // }

  return {
    success: true,
    message: ""
  };
};

export default {
  login,
  logout,
  sendVerificationToEmail,
  sendVerificationOtpToPhone,
  verifyOtpToVerfifyPhoneNumber,
  sendResetPasswordToEmail,
  sendResetPasswordOtpToPhone,
  verifyOtpToResetPasswordPhoneNumber
};
