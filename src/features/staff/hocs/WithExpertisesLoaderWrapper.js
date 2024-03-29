import React, { useState, useEffect } from "react";
import staffServices from "../../../services/staffServices";
import { useFetchingStore } from "../../../store/FetchingApiStore";

const WithExpertisesLoaderWrapper = (WrappedComponent) => {
  function ExpertisesLoaderWrapper(props) {
    const [expertisesList, setExpertisesList] = useState([]);

    const { fetchApi } = useFetchingStore();

    const loadExpertisesList = async () => {
      await fetchApi(async () => {
        const res = await staffServices.getStaffExpertises();

        if (res.success) {
          const expertisesData = res?.expertises;
          setExpertisesList(expertisesData);
          return { ...res };
        }
        setExpertisesList([]);
        return { ...res };
      });
    };

    useEffect(() => {
      loadExpertisesList();
    }, []);

    return <WrappedComponent expertisesList={expertisesList} loadExpertisesList={loadExpertisesList} {...props} />;
  }

  return ExpertisesLoaderWrapper;
};

export default WithExpertisesLoaderWrapper;
