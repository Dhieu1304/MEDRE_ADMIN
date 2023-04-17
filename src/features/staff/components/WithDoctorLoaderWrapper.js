import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import staffServices from "../../../services/staffServices";
import { useFetchingStore } from "../../../store/FetchingApiStore";

const WithDoctorLoaderWrapper = (WrappedComponent) => {
  function DoctorLoaderWrapper(props) {
    const [doctor, setDoctor] = useState();

    const params = useParams();

    const doctorId = params?.staffId;

    const { fetchApi } = useFetchingStore();

    const loadDoctor = async () => {
      await fetchApi(async () => {
        const res = await staffServices.getStaffDetail(doctorId);

        if (res.success) {
          setDoctor(res.staff);
          return { success: true, error: "" };
        }
        return { success: false, error: res.message };
      });
    };

    useEffect(() => {
      loadDoctor();
    }, []);

    return <WrappedComponent doctor={doctor} {...props} doctorId={doctorId} />;
  }

  return DoctorLoaderWrapper;
};

export default WithDoctorLoaderWrapper;
