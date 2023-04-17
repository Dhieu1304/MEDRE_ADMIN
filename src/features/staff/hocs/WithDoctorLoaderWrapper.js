import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import staffServices from "../../../services/staffServices";
import { useFetchingStore } from "../../../store/FetchingApiStore";

const WithDoctorLoaderWrapper = (WrappedComponent) => {
  function DoctorLoaderWrapper(props) {
    const [doctor, setDoctor] = useState({});

    const { staffId: doctorId } = props;

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

  DoctorLoaderWrapper.propTypes = {
    staffId: PropTypes.string.isRequired
  };

  return DoctorLoaderWrapper;
};

export default WithDoctorLoaderWrapper;
