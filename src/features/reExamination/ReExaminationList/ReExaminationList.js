import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import qs from "query-string";
import { FormProvider, useForm } from "react-hook-form";
import reExaminationServices from "../../../services/reExaminationServices";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { useFetchingStore } from "../../../store/FetchingApiStore";
// import ListPageTableWrapper from "../../../components/ListPageTableWrapper";
import ListPageTop from "../../../components/ListPageTop";
import CustomOverlay from "../../../components/CustomOverlay/CustomOverlay";
import ReExaminationFiltersForm from "./ReExaminationFiltersForm";
import { columnsIds, createDefaultValues, initialShowCols } from "./utils";
import useObjDebounce from "../../../hooks/useObjDebounce";
import ListPageAction from "../../../components/ListPageAction/ListPageAction";

function ReExaminationList() {
  const { locale } = useAppConfigStore();
  const [isFirst, setIsFirst] = useState(true);
  const [countRender, setCountRender] = useState(1);

  const [reExaminations, setReExaminations] = useState([]);
  const [count, setCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, fetchApi } = useFetchingStore();

  const { t } = useTranslation("reExaminationFeature", { keyPrefix: "ReExaminationList" });
  const { t: tReExamination } = useTranslation("reExaminationEntity", { keyPrefix: "properties" });

  const [showTableColsMenu, setShowTableColsMenu] = useState(null);
  const [showCols, setShowCols] = useState({
    ...initialShowCols,
    [columnsIds.healthInsurance]: false,
    [columnsIds.address]: false
  });

  const columns = useMemo(
    () => [
      {
        id: columnsIds.name,
        label: tReExamination(columnsIds.name),
        minWidth: 100
      },
      {
        id: columnsIds.phoneNumber,
        label: tReExamination(columnsIds.phoneNumber),
        minWidth: 100,
        hide: !showCols[columnsIds.phoneNumber]
      },
      {
        id: columnsIds.address,
        label: tReExamination(columnsIds.address),
        minWidth: 100,
        hide: !showCols[columnsIds.address]
      },
      {
        id: columnsIds.gender,
        label: tReExamination(columnsIds.gender),
        minWidth: 100,
        hide: !showCols[columnsIds.gender]
      },
      {
        id: columnsIds.dob,
        label: tReExamination(columnsIds.dob),
        minWidth: 100,
        hide: !showCols[columnsIds.dob]
      },
      {
        id: columnsIds.healthInsurance,
        label: tReExamination(columnsIds.healthInsurance),
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

  const { isApply, isRemind, idStaffRemind, dateRemind, dateReExam, limit } = watch();
  // delay 1000ms for search string
  const { debouncedObj: filterDebounce } = useObjDebounce(
    {
      isApply,
      isRemind,
      idStaffRemind,
      dateRemind,
      dateReExam,
      limit
    },
    1000
  );

  const loadData = async ({ page }) => {
    const paramsObj = {
      ...watch(),
      page
    };

    await fetchApi(async () => {
      const res = await reExaminationServices.getReExaminationList(paramsObj);

      let countData = 0;
      let reExaminationsData = [];

      if (res.success) {
        reExaminationsData = res?.reExaminations || [];
        countData = res?.count;
        setReExaminations(reExaminationsData);
        setCount(countData);

        return { ...res };
      }
      setReExaminations([]);
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
  }, [...Object.values(filterDebounce), isReset]);

  // console.log("reExaminations: ", reExaminations);

  return (
    <Box>
      <CustomOverlay open={isLoading} />

      <ListPageTop
        title={t("title")}
        filterFormNode={
          <FormProvider {...filterForm}>
            <ReExaminationFiltersForm />
          </FormProvider>
        }
      />

      <ListPageAction
        showCols={showCols}
        createDefaultValues={createDefaultValues}
        columns={columns}
        setValue={setValue}
        loadData={loadData}
        watch={watch}
        count={count}
        setShowCols={setShowCols}
        showTableColsMenu={showTableColsMenu}
        setShowTableColsMenu={setShowTableColsMenu}
        reset={reset}
        setIsReset={setIsReset}
      />

      {reExaminations.forEach(() => {})}

      {/* <ListPageTableWrapper
        table={<PatientTable patients={patients} columns={columns} showCols={showCols} />}
        count={count}
        watch={watch}
        loadData={loadData}
        setValue={setValue}
      /> */}
    </Box>
  );
}

export default ReExaminationList;
