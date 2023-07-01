import camelcaseKeys from "camelcase-keys";
import { expertiseApi, staffApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import { cleanUndefinedAndEmptyStrValueObject } from "../utils/objectUtil";

const createStaff = async ({ email, username, phoneNumber, name, role, password }) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    email,
    username,
    phone_number: phoneNumber,
    name,
    role,
    password
  });

  // console.log("dataBody: ", dataBody);
  //
  try {
    const res = await axiosClient.post(staffApi.createStaff(), dataBody);

    // console.log("res: ", res);

    if (res?.status) {
      const staff = camelcaseKeys(res?.data, { deep: true });

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

const getStaffList = async ({
  email,
  phoneNumber,
  username,
  name,
  type,
  expertise,
  page,
  limit,
  role,
  blocked,
  gender,
  address,
  healthInsurance,
  description,
  education,
  certificate,
  from,
  to
  // order
}) => {
  // console.log("getStaffList: ", { page, limit, name });
  // console.log("order: ", order);

  const params = cleanUndefinedAndEmptyStrValueObject({
    email,
    phone_number: phoneNumber,
    username,
    name,
    type,
    expertise,
    page,
    limit,
    role,
    blocked,
    gender,
    address,
    healthInsurance,
    description,
    education,
    certificate,
    from,
    to
  });

  // console.log("params: ", params);

  try {
    const res = await axiosClient.get(staffApi.staffList(), { params });

    // console.log("res: ", res);

    if (res?.status) {
      const staffs = camelcaseKeys(res?.data?.results, { deep: true });
      const count = res?.data?.totalResults;

      return {
        staffs,
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

const getStaffListWithSchedules = async ({ page, limit, date }) => {
  // console.log("getStaffList: ", { page, limit, name });

  const params = cleanUndefinedAndEmptyStrValueObject({
    page,
    limit,
    date
  });

  // console.log("params: ", params);

  try {
    const res = await axiosClient.get(staffApi.staffListWithSchedules(), { params });

    // let res = camelcaseKeys(
    //   {
    //     status: true,
    //     message: "",
    //     data: {
    //       staffs: staffMockData.list()
    //     }
    //   },
    //   { deep: true }
    // );

    // console.log("res: ", res);

    if (res?.status) {
      const staffs = camelcaseKeys(res?.data?.results, { deep: true });
      const count = res?.data?.totalResults;

      return {
        staffs,
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

const getStaffInfo = async () => {
  try {
    const res = await axiosClient.get(staffApi.staffInfo());

    // console.log("res: ", res);

    if (res?.status) {
      const staff = camelcaseKeys(res?.data, { deep: true });

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

const getStaffDetail = async (id) => {
  try {
    const res = await axiosClient.get(staffApi.staffDetail(id));

    if (res?.status) {
      const staff = camelcaseKeys(res?.data, { deep: true });

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

const getStaffExpertises = async () => {
  try {
    const res = await axiosClient.get(expertiseApi.expertiseList());

    if (res?.status) {
      const expertises = camelcaseKeys(res?.data, { deep: true });

      return {
        expertises,
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

const createExpertise = async (name) => {
  try {
    const res = await axiosClient.post(expertiseApi.createExpertise(), {
      name
    });

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
    // console.error(e.message);
    return {
      success: false,
      message: e.message
    };
  }
};

const editStaffInfo = async (
  id,
  {
    username,
    phoneNumber,
    email,
    name,
    address,
    gender,
    dob,
    description,
    education,
    healthInsurance,
    certificate,
    expertises
  }
) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    username,
    phone_number: phoneNumber,
    email,
    name,
    address,
    gender,
    dob,
    description,
    education,
    health_insurance: healthInsurance,
    certificate,
    expertise: expertises
  });

  // console.log("dataBody: ", dataBody);
  try {
    const res = await axiosClient.post(staffApi.editStaff(id), dataBody);

    // console.log("editStaffInfo res: ", res);

    if (res?.status) {
      const staff = camelcaseKeys(res?.data?.staff, { deep: true });

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

const editMyProfile = async ({
  email,
  username,
  phoneNumber,
  name,
  address,
  gender,
  dob,
  description,
  education,
  healthInsurance,
  certificate,
  image
  // expertises
}) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    email,
    phone_number: phoneNumber,
    username,
    name,
    address,
    gender,
    dob,
    description,
    education,
    health_insurance: healthInsurance,
    certificate,
    image
    // expertises
  });
  // console.log("dataBody: ", dataBody);

  try {
    const res = await axiosClient.post(staffApi.editMyProfile(), dataBody);

    // console.log("res: ", res);

    if (res?.status) {
      const staff = camelcaseKeys(res?.data?.staff, { deep: true });

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

const editStaffRole = async (id, { role }) => {
  try {
    const res = await axiosClient.post(staffApi.editStaff(id), {
      role
    });

    // console.log("res: ", res);

    if (res?.status) {
      const staff = camelcaseKeys(res?.data?.staff, { deep: true });

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

const blockStaff = async (id, reason) => {
  try {
    // console.log("blockStaff: ", { id, reason });
    const res = await axiosClient.post(staffApi.blockStaff(), {
      id_account: id,
      reason
    });

    if (res?.status) {
      const staff = camelcaseKeys(res?.data?.staff, { deep: true });

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

const unblockStaff = async (id, reason) => {
  try {
    // console.log("unblockStaff: ", { id, reason });
    const res = await axiosClient.post(staffApi.unblockStaff(), {
      id_account: id,
      reason
    });

    if (res?.status) {
      const staff = camelcaseKeys(res?.data?.staff, { deep: true });

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

const changePassword = async ({ oldPassword, newPassword, confirmPassword }) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    old_password: oldPassword,
    new_password: newPassword,
    confirm_password: confirmPassword
  });

  // console.log("dataBody: ", dataBody);

  try {
    const res = await axiosClient.post(staffApi.changePassword(), dataBody);

    // console.log("changePassword res: ", res);

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

const uploadAvatar = async (file) => {
  // console.log("file: ", file);
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axiosClient.post("/upload/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    // console.log("res: ", res);

    if (res?.status) {
      const image = res?.data;
      return {
        image,
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

const changeAvatar = async (file) => {
  const uploadAvatarResult = await uploadAvatar(file);

  // console.log("uploadAvatarResult: ", uploadAvatarResult);
  if (uploadAvatarResult?.success) {
    const image = uploadAvatarResult?.image;
    // console.log("image: ", image);
    const changeAvatarResult = await editMyProfile({ image });

    // console.log("changeAvatarResult: ", changeAvatarResult);
    return changeAvatarResult;
  }

  return uploadAvatarResult;
};

export default {
  createStaff,
  getStaffList,
  getStaffListWithSchedules,
  getStaffDetail,
  getStaffExpertises,
  getStaffInfo,
  createExpertise,
  editStaffInfo,
  editMyProfile,
  editStaffRole,
  blockStaff,
  unblockStaff,
  changePassword,
  changeAvatar
};
