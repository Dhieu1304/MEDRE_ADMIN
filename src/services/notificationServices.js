import camelcaseKeys from "camelcase-keys";
import { notificationApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import { cleanUndefinedAndEmptyStrValueObject } from "../utils/objectUtil";

const getNotificationList = async ({ type, read, page, limit } = {}) => {
  const params = cleanUndefinedAndEmptyStrValueObject({
    type,
    read,
    page,
    limit
  });

  // console.log("params: ", params);
  try {
    const res = await axiosClient.get(notificationApi.notificationList(), {
      params
    });
    // console.log("res: ", res);

    if (res?.status) {
      const notifications = camelcaseKeys(res?.data?.results, { deep: true });

      // const page = camelcaseKeys(res?.data?.page, { deep: true });
      // const limit = camelcaseKeys(res?.data?.limit, { deep: true });
      // const totalPages = camelcaseKeys(res?.data?.totalPages, { deep: true });
      // const count = camelcaseKeys(res?.data?.totalResults, { deep: true });

      return {
        notifications,
        page: camelcaseKeys(res?.data?.page, { deep: true }),
        limit: camelcaseKeys(res?.data?.limit, { deep: true }),
        totalPages: camelcaseKeys(res?.data?.totalPages, { deep: true }),
        count: camelcaseKeys(res?.data?.totalResults, { deep: true }),
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
    // console.error("e: ", e);
    return {
      success: false,
      message: e.message
    };
  }
};

const markRead = async (id) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    id
  });

  // console.log("dataBody: ", dataBody);
  try {
    const res = await axiosClient.post(notificationApi.markRead(), dataBody);
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
    // console.error("e: ", e);
    return {
      success: false,
      message: e.message
    };
  }
};

const countUnread = async () => {
  try {
    const res = await axiosClient.get(notificationApi.countUnread());
    // console.log("res: ", res);

    if (res?.status) {
      const unreadCount = res?.data;
      return {
        unreadCount,
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
    // console.error("e: ", e);
    return {
      success: false,
      message: e.message
    };
  }
};

const subscribeTopic = async (registrationToken) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    registrationToken
  });

  // console.log("dataBody: ", dataBody);
  try {
    const res = await axiosClient.post(notificationApi.subscribeTopic(), dataBody);
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
    // console.error("e: ", e);
    return {
      success: false,
      message: e.message
    };
  }
};

const unSubscribeTopic = async (registrationToken) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    registrationToken
  });

  // console.log("dataBody: ", dataBody);
  try {
    const res = await axiosClient.post(notificationApi.unSubscribeTopic(), dataBody);
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
    // console.error("e: ", e);
    return {
      success: false,
      message: e.message
    };
  }
};

export default {
  getNotificationList,
  markRead,
  countUnread,
  subscribeTopic,
  unSubscribeTopic
};
