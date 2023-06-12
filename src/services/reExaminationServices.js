import camelcaseKeys from "camelcase-keys";
import { reExaminationApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import { cleanUndefinedAndEmptyStrValueObject } from "../utils/objectUtil";

const getReExaminationList = async ({
  isApply,
  isRemind,
  dateReExam,
  idStaffRemind,
  dateRemind,
  order, // valid('createdAt:asc', 'createdAt:desc', 'updatedAt:asc', 'updatedAt:desc', 'date_re_exam:asc', 'date_re_exam:desc') //default('date_re_exam:asc'),
  page,
  limit
} = {}) => {
  const params = cleanUndefinedAndEmptyStrValueObject({
    is_apply: isApply,
    is_remind: isRemind,
    date_re_exam: dateReExam,
    id_staff_remind: idStaffRemind,
    date_remind: dateRemind,
    order,
    page,
    limit
  });

  // console.log("params: ", params);
  try {
    const res = await axiosClient.get(reExaminationApi.reExaminationList(), {
      params
    });
    // console.log("res: ", res);

    if (res?.status) {
      const reExaminations = camelcaseKeys(res?.data?.results, { deep: true });
      const count = camelcaseKeys(res?.data?.totalResults, { deep: true });

      return {
        reExaminations,
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

const updateReExamination = async ({ id, isApply, isRemind, dateReExam }) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    id,
    date_re_exam: dateReExam,
    is_apply: isApply,
    is_remind: isRemind
  });
  // console.log("dataBody: ", dataBody);
  try {
    const res = await axiosClient.post(reExaminationApi.updateReExamination(), dataBody);
    // console.log("Update");
    if (res?.status) {
      const data = camelcaseKeys(res?.data, { deep: true });
      // console.log("res: ", res);

      return {
        data,
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
  getReExaminationList,
  updateReExamination
};
