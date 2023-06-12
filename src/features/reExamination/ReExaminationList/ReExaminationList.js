import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import qs from "query-string";
import { FormProvider, useForm } from "react-hook-form";
import reExaminationServices from "../../../services/reExaminationServices";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import ListPageTableWrapper from "../../../components/ListPageTableWrapper";
import ListPageTop from "../../../components/ListPageTop";
import CustomOverlay from "../../../components/CustomOverlay/CustomOverlay";
import ReExaminationFiltersForm from "./ReExaminationFiltersForm";
import { columnsIds, createDefaultValues, initialShowCols } from "./utils";
import useObjDebounce from "../../../hooks/useObjDebounce";
import ListPageAction from "../../../components/ListPageAction/ListPageAction";
import ReExaminationTable from "./ReExaminationTable";
import { normalizeStrToDateStr } from "../../../utils/standardizedForForm";

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
    bookingUserEmail: false
  });

  const columns = useMemo(
    () => [
      {
        id: columnsIds.dateRemind,
        label: tReExamination(columnsIds.dateRemind),
        minWidth: 100
        // hide: !showCols[columnsIds.phoneNumber]
      },
      {
        id: columnsIds.bookingDate,
        label: tReExamination("booking.date"),
        minWidth: 100,
        hide: !showCols[columnsIds.bookingDate]
      },
      {
        id: columnsIds.dateReExam,
        label: tReExamination(columnsIds.dateReExam),
        minWidth: 100,
        hide: !showCols[columnsIds.dateReExam]
      },
      {
        id: columnsIds.bookingUserPhoneNumber,
        label: tReExamination("bookingUser.phoneNumber"),
        minWidth: 100,
        hide: !showCols[columnsIds.bookingUserPhoneNumber]
      },
      {
        id: columnsIds.bookingUserEmail,
        label: tReExamination("bookingUser.email"),
        minWidth: 100,
        hide: !showCols[columnsIds.bookingUserEmail]
      },
      {
        id: columnsIds.bookingUserName,
        label: tReExamination("bookingUser.name"),
        minWidth: 200,
        hide: !showCols[columnsIds.bookingUserName]
      },
      {
        id: columnsIds.isApply,
        label: tReExamination(columnsIds.isApply),
        minWidth: 100,
        hide: !showCols[columnsIds.isApply]
      },
      {
        id: columnsIds.isRemind,
        label: tReExamination(columnsIds.isRemind),
        minWidth: 100,
        hide: !showCols[columnsIds.isRemind]
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

  const updateReExaminationForm = useForm({
    defaultValues: {
      reExaminations
    },
    mode: "onChange",
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

        const newUpdateReExaminationFormExaminations = reExaminationsData?.map((reExamination) => {
          return {
            isApply: reExamination?.isApply,
            isRemind: reExamination?.isRemind,
            dateReExam: normalizeStrToDateStr(reExamination?.dateReExam)
          };
        });
        updateReExaminationForm.reset({
          reExaminations: newUpdateReExaminationFormExaminations
        });

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

  const handleAfterSaveReExamination = async () => {
    await loadData({ page: watch().page });
  };

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

      <ListPageTableWrapper
        table={
          <FormProvider {...updateReExaminationForm}>
            <ReExaminationTable
              reExaminations={reExaminations}
              columns={columns}
              showCols={showCols}
              handleAfterSaveReExamination={handleAfterSaveReExamination}
            />
          </FormProvider>
        }
        count={count}
        watch={watch}
        loadData={loadData}
        setValue={setValue}
      />
    </Box>
  );
}

export default ReExaminationList;
