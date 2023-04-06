import camelcaseKeys from "camelcase-keys";
import { expertiseApi, staffApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
// import staffMockData from "../mockData/staffMockData";

const getStaffList = async ({ page, limit, expertise, type, from, to, name }) => {
  // console.log("getStaffList: ", { page, limit, expertise, type, from, to, name });
  try {
    const res = await axiosClient.get(staffApi.staffList(), { params: { page, limit, expertise, type, from, to, name } });

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

    if (res?.status) {
      const staffs = camelcaseKeys(res?.data?.results, { deep: true });
      const count = res?.data?.totalResults;

      return {
        success: true,
        staffs,
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

const getStaffInfo = async () => {
  try {
    const res = await axiosClient.get(staffApi.staffInfo());

    if (res?.status) {
      const staff = camelcaseKeys(res?.data?.staff, { deep: true });

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

const getStaffDetail = async (id) => {
  try {
    const res = await axiosClient.get(staffApi.staffDetail(id));

    // const res = camelcaseKeys(
    //   {
    //     status: true,
    //     message: "",
    //     data: {
    //       staff: staffMockData.detail(id)
    //     }
    //   },
    //   { deep: true }
    // );

    if (res?.status) {
      const staff = camelcaseKeys(res?.data, { deep: true });

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

const getStaffExpertises = async () => {
  try {
    const res = await axiosClient.get(expertiseApi.expertiseList());

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

    if (res?.status) {
      const expertises = camelcaseKeys(res?.data, { deep: true });

      return {
        success: true,
        expertises,
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

const createExpertise = async (name) => {
  try {
    const res = await axiosClient.post(expertiseApi.createExpertise(), {
      name
    });

    if (res?.status) {
      return {
        success: true,
        message: res?.message
      };
    }
    return {
      success: false,
      message: res?.message
    };
  } catch (e) {
    // console.error(e.message);
    return {
      success: false,
      message: e.message
    };
  }
};

const editStaffInfo = async () => {
  try {
    const res = await axiosClient.get(staffApi.editStaff());

    // console.log("res: ", res);

    if (res?.status) {
      const staff = camelcaseKeys(res?.data?.staff, { deep: true });

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

const editMyProfile = async ({
  username,
  email,
  phoneNumber,
  name,
  address,
  gender,
  dob,
  role,
  status,
  description,
  education,
  certificate,
  expertise
}) => {
  try {
    const res = await axiosClient.post(staffApi.editMyProfile(), {
      username,
      email,
      phoneNumber,
      name,
      address,
      gender,
      dob,
      role,
      status,
      description,
      education,
      certificate,
      expertise
    });

    // console.log("res: ", res);

    if (res?.status) {
      const staff = camelcaseKeys(res?.data?.staff, { deep: true });

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

export default {
  getStaffList,
  getStaffDetail,
  getStaffExpertises,
  getStaffInfo,
  createExpertise,
  editStaffInfo,
  editMyProfile
};