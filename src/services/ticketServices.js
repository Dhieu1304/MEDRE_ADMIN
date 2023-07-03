import camelcaseKeys from "camelcase-keys";
import { ticketApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import { cleanUndefinedAndEmptyStrValueObject } from "../utils/objectUtil";

const getTickets = async ({ status, page, limit, order }) => {
  // console.log("getUserList: ", { page, limit, name });

  const params = cleanUndefinedAndEmptyStrValueObject({
    status,
    page,
    limit,
    order
  });

  // console.log("params: ", params);
  try {
    const res = await axiosClient.get(ticketApi.ticketList(), {
      params
    });

    // console.log("res: ", res);
    if (res?.status) {
      const tickets = camelcaseKeys(res?.data?.results, { deep: true });
      const count = res?.data?.totalResults;

      return {
        tickets,
        count,
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

const getTicketDetail = async (id) => {
  try {
    // console.log("id: ", id);

    const res = await axiosClient.get(ticketApi.ticketDetail(id));

    // console.log("res: ", res);

    if (res?.status) {
      const ticket = camelcaseKeys(res?.data, { deep: true });

      return {
        ticket,
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

const responseTicket = async ({ id, content }) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    id_ticket: id,
    content
  });

  try {
    const res = await axiosClient.post(ticketApi.responseTicket(), dataBody);

    if (res?.status) {
      const ticket = camelcaseKeys(res?.data, { deep: true });

      return {
        ticket,
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

const updateTicket = async ({ id, status }) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    id_ticket: id,
    status
  });

  try {
    const res = await axiosClient.post(ticketApi.updateTicket(), dataBody);

    if (res?.status) {
      const ticket = camelcaseKeys(res?.data, { deep: true });

      return {
        ticket,
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
  getTickets,
  getTicketDetail,
  updateTicket,
  responseTicket
};
