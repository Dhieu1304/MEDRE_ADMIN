import React, { useEffect, useMemo, useState } from "react";

import { Box } from "@mui/material";
import qs from "query-string";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import patientServices from "../../../services/patientServices";
import { useFetchingStore } from "../../../store/FetchingApiStore/hooks";
import { useAppConfigStore } from "../../../store/AppConfigStore/hooks";

import useObjDebounce from "../../../hooks/useObjDebounce";

import PatientFiltersForm from "./PatientFiltersForm";
import PatientTable from "./PatientTable";

import { columnsIds, createDefaultValues, initialShowCols } from "./utils";
import CustomOverlay from "../../../components/CustomOverlay/CustomOverlay";
import ListPageAction from "../../../components/ListPageAction/ListPageAction";
import ListPageTableWrapper from "../../../components/ListPageTableWrapper";
import ListPageTop from "../../../components/ListPageTop";

function PatientList() {
  const { locale } = useAppConfigStore();
  const [isFirst, setIsFirst] = useState(true);
  const [countRender, setCountRender] = useState(1);

  const [patients, setPatients] = useState([]);
  const [count, setCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, fetchApi } = useFetchingStore();

  // functions for multilingual use

  const { t } = useTranslation("patientFeature", { keyPrefix: "PatientList" });
  const { t: tPatient } = useTranslation("patientEntity", { keyPrefix: "properties" });

  // state is used to represent the visibility of the Menu
  // (This menu allows the patient to hide or show custom columns)
  const [showTableColsMenu, setShowTableColsMenu] = useState(null);

  /*
    The keys of this object represent column-by-column visibility
    We will hide address, healthInsurance for the first time
  */
  const [showCols, setShowCols] = useState({
    ...initialShowCols,
    [columnsIds.healthInsurance]: false,
    [columnsIds.address]: false
  });

  const columns = useMemo(
    () => [
      {
        id: columnsIds.name,
        label: tPatient(columnsIds.name),
        minWidth: 100
      },
      {
        id: columnsIds.phoneNumber,
        label: tPatient(columnsIds.phoneNumber),
        minWidth: 100,
        hide: !showCols[columnsIds.phoneNumber]
      },
      {
        id: columnsIds.address,
        label: tPatient(columnsIds.address),
        minWidth: 100,
        hide: !showCols[columnsIds.address]
      },
      {
        id: columnsIds.gender,
        label: tPatient(columnsIds.gender),
        minWidth: 100,
        hide: !showCols[columnsIds.gender]
      },
      {
        id: columnsIds.dob,
        label: tPatient(columnsIds.dob),
        minWidth: 100,
        hide: !showCols[columnsIds.dob]
      },
      {
        id: columnsIds.healthInsurance,
        label: tPatient(columnsIds.healthInsurance),
        minWidth: 200,
        hide: !showCols[columnsIds.healthInsurance]
      },
      {
        id: columnsIds.action,
        label: "",
        minWidth: 100
      }
    ],
    [locale, showCols]
  );

  const defaultValues = useMemo(() => {
    const defaultSearchParams = qs.parse(location.search);
    const result = createDefaultValues(defaultSearchParams);
    return result;
  }, []);

  const filterForm = useForm({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all"
  });

  const [isReset, setIsReset] = useState(false);

  const { watch, setValue, reset } = filterForm;

  const { phoneNumber, name, address, healthInsurance } = watch();
  // delay 1000ms for search string
  const { debouncedObj: searchDebounce } = useObjDebounce(
    {
      phoneNumber,
      name,
      address,
      healthInsurance
    },
    1000
  );

  const { limit, status, gender } = watch();
  // delay 1000ms for selection and datetime
  const { debouncedObj: filterDebounce } = useObjDebounce(
    {
      limit,
      status,
      gender
    },
    1000
  );

  const loadData = async ({ page }) => {
    const paramsObj = {
      ...watch(),
      page
    };

    await fetchApi(async () => {
      const res = await patientServices.getPatients(paramsObj);

      let countData = 0;
      let patientsData = [];

      if (res.success) {
        patientsData = res?.patients || [];
        countData = res?.count;
        setPatients(patientsData);
        setCount(countData);

        return { success: true };
      }
      setPatients([]);
      setCount(0);
      return { error: res.message };
    });
  };

  useEffect(() => {
    // console.log("isReset change");

    if (isFirst) {
      setIsFirst(false);
      setCountRender((prev) => prev + 1);
    }

    let page = 1;
    if (countRender <= 2) {
      page = watch().page;
      setCountRender((prev) => prev + 1);
    }

    const params = { ...watch(), page };

    const searchParams = qs.stringify(params);
    setValue("page", page);
    navigate(`?${searchParams}`);
    loadData({ page });
  }, [...Object.values(filterDebounce), ...Object.values(searchDebounce), isReset]);

  return (
    <Box>
      <CustomOverlay open={isLoading} />

      <ListPageTop
        title={t("title")}
        filterFormNode={
          <FormProvider {...filterForm}>
            <PatientFiltersForm />
          </FormProvider>
        }
      />

      <ListPageAction
        showCols={showCols}
        setShowCols={setShowCols}
        showTableColsMenu={showTableColsMenu}
        setShowTableColsMenu={setShowTableColsMenu}
        reset={reset}
        setIsReset={setIsReset}
        createDefaultValues={createDefaultValues}
        columns={columns}
        setValue={setValue}
        loadData={loadData}
        watch={watch}
        count={count}
      />

      <ListPageTableWrapper
        table={<PatientTable patients={patients} columns={columns} showCols={showCols} />}
        count={count}
        watch={watch}
        loadData={loadData}
        setValue={setValue}
      />
    </Box>
  );
}

export default PatientList;
