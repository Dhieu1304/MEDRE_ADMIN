import Cookies from "js-cookie";
import cookiesUtil from "./cookiesUtil";

export const saveToken = ({ access, refresh }) => {
  //   localStorageUtil.setItem(localStorageUtil.LOCAL_STORAGE.ACCESS_TOKEN, access?.token);
  //   localStorageUtil.setItem(localStorageUtil.LOCAL_STORAGE.ACCESS_TOKEN_EXP, access?.expires);
  //   localStorageUtil.setItem(localStorageUtil.LOCAL_STORAGE.REFRESH_TOKEN, refresh?.token);
  //   localStorageUtil.setItem(localStorageUtil.LOCAL_STORAGE.REFRESH_TOKEN_EXP, refresh?.expires);

  Cookies.set(cookiesUtil.COOKIES.ACCESS_TOKEN, access?.token, {
    expires: access?.expires && new Date(access?.expires)
  });
  Cookies.set(cookiesUtil.COOKIES.REFRESH_TOKEN, refresh?.token, {
    expires: refresh?.expires && new Date(refresh?.expires)
  });
};

export const clearToken = () => {
  //   localStorageUtil.removeItem(localStorageUtil.LOCAL_STORAGE.ACCESS_TOKEN);
  //   localStorageUtil.removeItem(localStorageUtil.LOCAL_STORAGE.REFRESH_TOKEN);
  //   localStorageUtil.removeItem(localStorageUtil.LOCAL_STORAGE.ACCESS_TOKEN_EXP);
  //   localStorageUtil.removeItem(localStorageUtil.LOCAL_STORAGE.REFRESH_TOKEN_EXP);

  Cookies.remove(cookiesUtil.COOKIES.ACCESS_TOKEN);
  Cookies.remove(cookiesUtil.COOKIES.REFRESH_TOKEN);
};
