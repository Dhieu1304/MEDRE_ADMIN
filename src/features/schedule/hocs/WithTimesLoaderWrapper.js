import React, { useState, useEffect } from "react";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import scheduleServices from "../../../services/scheduleServices";

const WithTimesLoaderWrapper = (WrappedComponent) => {
  function TimesLoaderWrapper(props) {
    const [timesList, setTimesList] = useState([]);

    const { fetchApi } = useFetchingStore();

    const loadTimesList = async () => {
      await fetchApi(async () => {
        const res = await scheduleServices.getTimeList();

        if (res.success) {
          const timesData = res?.times;
          setTimesList(timesData);
          return { ...res };
        }
        setTimesList([]);
        return { ...res };
      });
    };

    useEffect(() => {
      loadTimesList();
    }, []);

    return <WrappedComponent timesList={timesList} {...props} />;
  }

  return TimesLoaderWrapper;
};

export default WithTimesLoaderWrapper;
