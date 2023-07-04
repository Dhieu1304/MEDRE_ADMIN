import React, { useEffect, useMemo, useState } from "react";

import { Box, useTheme } from "@mui/material";
import qs from "query-string";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import formatDate from "date-and-time";

import { CalendarMonth as CalendarMonthIcon, Search as SearchIcon } from "@mui/icons-material";
import patientServices from "../../../services/patientServices";
import { useFetchingStore } from "../../../store/FetchingApiStore/hooks";
import { useAppConfigStore } from "../../../store/AppConfigStore/hooks";

import useObjDebounce from "../../../hooks/useObjDebounce";

import PatientFiltersForm from "./PatientFiltersForm";

import { columnsIds, createDefaultValues, initialShowCols } from "./utils";
import CustomOverlay from "../../../components/CustomOverlay/CustomOverlay";
import ListPageAction from "../../../components/ListPageAction/ListPageAction";
import ListPageTableWrapper from "../../../components/ListPageTableWrapper";
import ListPageTop from "../../../components/ListPageTop";
import CopyButton from "../../../components/CopyButton";
import { getSortValue } from "../../../utils/objectUtil";
import DataTable from "../../components/DataFilterTable/DataTable";
import { usePatientGendersContantTranslation } from "../hooks/usePatientConstantsTranslation";
import routeConfig from "../../../config/routeConfig";

function PatientList() {
  const { locale } = useAppConfigStore();
  const [isFirst, setIsFirst] = useState(true);
  const [countRender, setCountRender] = useState(1);

  const [patients, setPatients] = useState([]);
  const [count, setCount] = useState(0);
  const [sort, setSort] = useState({
    sortBy: columnsIds.name,
    isAsc: true
  });

  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, fetchApi } = useFetchingStore();

  // functions for multilingual use

  const [, patientGenderContantListObj] = usePatientGendersContantTranslation();

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
        haveSortIcon: true,
        label: tPatient(columnsIds.name),
        minWidth: 100,
        render: (patient) => patient?.name,
        fixed: true
      },
      {
        id: columnsIds.phoneNumber,
        haveSortIcon: true,
        label: tPatient(columnsIds.phoneNumber),
        minWidth: 100,
        hide: !showCols[columnsIds.phoneNumber],
        render: (patient) => patient?.phoneNumber
      },
      {
        id: columnsIds.address,
        label: tPatient(columnsIds.address),
        minWidth: 100,
        hide: !showCols[columnsIds.address],
        render: (patient) => patient?.address
      },
      {
        id: columnsIds.gender,
        haveSortIcon: true,
        label: tPatient(columnsIds.gender),
        minWidth: 100,
        hide: !showCols[columnsIds.gender],
        render: (patient) => patientGenderContantListObj?.[patient?.gender]?.label
      },
      {
        id: columnsIds.dob,
        haveSortIcon: true,
        label: tPatient(columnsIds.dob),
        minWidth: 100,
        hide: !showCols[columnsIds.dob],
        render: (patient) => patient?.dob && formatDate.format(new Date(patient?.dob), "DD/MM/YYYY")
      },
      {
        id: columnsIds.healthInsurance,
        label: tPatient(columnsIds.healthInsurance),
        minWidth: 200,
        hide: !showCols[columnsIds.healthInsurance],
        render: (patient) => patient?.healthInsurance
      },
      {
        id: columnsIds.action,
        label: "",
        minWidth: 100,
        render: (patient) => {
          const patientPath = routeConfig.patient;
          const patientBookingSearchParams = {
            patientId: patient?.id
          };
          const patientBookingSearchParamsUrl = qs.stringify(patientBookingSearchParams);

          return (
            <>
              <Box sx={{ ml: 2 }} component={Link} to={`${routeConfig.booking}?${patientBookingSearchParamsUrl}`}>
                <CalendarMonthIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
              </Box>

              <Box sx={{ ml: 1, mr: 1 }} component={Link} to={`${patientPath}/${patient?.id}`}>
                <SearchIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
              </Box>

              <CopyButton content={patient?.id} />
            </>
          );
        },
        action: true
      }
    ],
    [locale, showCols, patients]
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
    const orderBy = sort.isAsc ? "asc" : "desc";
    let order;
    if (sort.sortBy) {
      //  { username, phoneNumber, email, name, dob, role, status }
      // console.log("columnsIds: ", columnsIds);
      const sortByFormat = getSortValue(
        columnsIds,
        {
          phoneNumber: "phone_number",
          name: "name",
          gender: "gender",
          dob: "dob"
        },
        sort.sortBy
      );

      // console.log("sortByFormat: ", sortByFormat);
      if (sortByFormat) {
        order = `${sortByFormat}:${orderBy}`;
      }
    }

    const paramsObj = {
      ...watch(),
      page,
      order
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

        return { ...res };
      }
      setPatients([]);
      setCount(0);
      return { ...res };
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
  }, [...Object.values(filterDebounce), ...Object.values(searchDebounce), isReset, sort]);

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
        table={<DataTable rows={patients} columns={columns} showCols={showCols} sort={sort} setSort={setSort} />}
        count={count}
        watch={watch}
        loadData={loadData}
        setValue={setValue}
      />
    </Box>
  );
}

export default PatientList;
