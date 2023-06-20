import { uploadApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";

const uploadImage = async (file) => {
  // console.log("file: ", file);
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axiosClient.post(uploadApi.upload(), formData, {
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

export default {
  uploadImage
};
