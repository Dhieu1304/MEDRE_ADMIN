import camelcaseKeys from "camelcase-keys";
import { patientApi } from "../config/apiConfig";
import axiosClient from "../config/axiosClient";
import { cleanUndefinedAndEmptyStrValueObject } from "../utils/objectUtil";

const createPatient = async ({ phoneNumber, name, gender, address, dob, healthInsurance }) => {
  const dataBody = cleanUndefinedAndEmptyStrValueObject({
    phone_number: phoneNumber,
    name,
    gender,
    address,
    dob,
    health_insurance: healthInsurance
  });

  try {
    const res = await axiosClient.post(patientApi.createPatient(), dataBody);

    if (res?.status) {
      const patient = camelcaseKeys(res?.data, { deep: true });

      return {
        success: true,
        patient,
        message: res?.message
      };
    }
    return {
      success: false,
      message: res?.message || `Status is ${res.status}`
    };
  } catch (e) {
    // console.error(e.message);
    return {
      success: false,
      message: e.message
    };
  }
};

const getPatients = async ({ phoneNumber }) => {
  const params = cleanUndefinedAndEmptyStrValueObject({
    phoneNumber
  });

  try {
    const res = await axiosClient.get(patientApi.patientList(), {
      params
    });

    if (res?.status) {
      const patients = camelcaseKeys(res?.data?.results, { deep: true });

      return {
        success: true,
        patients,
        message: res?.message
      };
    }
    return {
      success: false,
      message: res?.message || `Status is ${res.status}`
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
  createPatient,
  getPatients
};