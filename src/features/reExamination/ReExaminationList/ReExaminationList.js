import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Checkbox, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import qs from "query-string";
import { FormProvider, useForm } from "react-hook-form";
import formatDate from "date-and-time";
import { CalendarMonth as CalendarMonthIcon } from "@mui/icons-material";
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
import DataTable from "../../components/DataFilterTable/DataTable";
import { getSortValue } from "../../../utils/objectUtil";
import { Can } from "../../../store/AbilityStore";
import { reExaminationActionAbility } from "../../../entities/ReExamination";
import entities from "../../../entities/entities";
import routeConfig from "../../../config/routeConfig";
// import { useCustomModal } from "../../../components/CustomModal";
// import BookingAnInfoModal from "../../booking/components/BookingAnInfoModal";

function ReExaminationList() {
  const { locale } = useAppConfigStore();
  const [isFirst, setIsFirst] = useState(true);
  const [countRender, setCountRender] = useState(1);

  const [reExaminations, setReExaminations] = useState([]);
  const [count, setCount] = useState(0);
  const [sort, setSort] = useState({
    sortBy: columnsIds.dateReExam,
    isAsc: true
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, fetchApi } = useFetchingStore();
  const theme = useTheme();

  const { t } = useTranslation("reExaminationFeature", { keyPrefix: "ReExaminationList" });
  const { t: tReExamination } = useTranslation("reExaminationEntity", { keyPrefix: "properties" });
  const { t: tReExaminationConstants } = useTranslation("reExaminationEntity", { keyPrefix: "constants" });

  // const bookingAnInfoModal = useCustomModal();

  const [showTableColsMenu, setShowTableColsMenu] = useState(null);
  const [showCols, setShowCols] = useState({
    ...initialShowCols,
    bookingUserEmail: false
  });

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

  const { watch, setValue, reset } = filterForm;

  const loadData = async ({ page }) => {
    const orderBy = sort.isAsc ? "asc" : "desc";
    // console.log("sort: ", sort);
    let order;
    if (sort.sortBy) {
      //  { username, phoneNumber, email, name, dob, role, status }
      // console.log("columnsIds: ", columnsIds);
      const sortByFormat = getSortValue(
        columnsIds,
        {
          dateReExam: "date_re_exam"
        },
        sort.sortBy
      );

      // console.log("sortByFormat: ", sortByFormat);
      if (sortByFormat) {
        order = `${sortByFormat}:${orderBy}`;
      }
    }

    // console.log("order: ", order);

    const paramsObj = {
      ...watch(),
      page,
      order
    };

    await fetchApi(
      async () => {
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
      },
      { hideSuccessToast: true }
    );
  };

  const handleSaveReExamination = async (id, newIsRemind) => {
    const data = {
      id,
      isRemind: newIsRemind
    };
    // console.log("data: ", data);

    await fetchApi(
      async () => {
        const res = await reExaminationServices.updateReExamination(data);
        if (res?.success) {
          await loadData({ page: watch().page });
        }
        return { ...res };
      },
      { hideSuccessToast: true }
    );
  };

  const columns = useMemo(() => {
    const cols = [
      {
        id: columnsIds.bookingUserName,
        label: tReExamination("bookingUser.name"),
        minWidth: 200,
        hide: !showCols[columnsIds.bookingUserName],
        render: (reExamination) => reExamination?.reExamOfBooking?.bookingOfUser?.name,
        fixed: true
      },
      {
        id: columnsIds.bookingDate,
        label: tReExamination("booking.date"),
        minWidth: 100,
        hide: !showCols[columnsIds.bookingDate],
        render: (reExamination) =>
          reExamination?.reExamOfBooking?.date &&
          formatDate.format(new Date(reExamination?.reExamOfBooking?.date), "DD/MM/YYYY")
      },
      {
        id: columnsIds.dateReExam,
        haveSortIcon: true,
        label: tReExamination(columnsIds.dateReExam),
        minWidth: 100,
        hide: !showCols[columnsIds.dateReExam],
        render: (reExamination) =>
          reExamination?.dateReExam && formatDate.format(new Date(reExamination?.dateReExam), "DD/MM/YYYY")
      },
      {
        id: columnsIds.bookingUserPhoneNumber,
        label: tReExamination("bookingUser.phoneNumber"),
        minWidth: 100,
        hide: !showCols[columnsIds.bookingUserPhoneNumber],
        render: (reExamination) => reExamination?.reExamOfBooking?.bookingOfUser?.phoneNumber
      },
      {
        id: columnsIds.bookingUserEmail,
        label: tReExamination("bookingUser.email"),
        minWidth: 100,
        hide: !showCols[columnsIds.bookingUserEmail],
        render: (reExamination) => reExamination?.reExamOfBooking?.bookingOfUser?.email
      },
      {
        id: columnsIds.isRemind,
        label: tReExamination(columnsIds.isRemind),
        minWidth: 40,
        hide: !showCols[columnsIds.isRemind],
        render: (reExamination) => {
          return (
            <>
              <Can I={reExaminationActionAbility.UPDATE} a={entities.RE_EXAMINATION}>
                <Checkbox
                  value={reExamination?.isRemind}
                  checked={reExamination?.isRemind}
                  onChange={async () => {
                    await handleSaveReExamination(reExamination?.id, !reExamination?.isRemind);
                  }}
                />
              </Can>
              <Can not I={reExaminationActionAbility.UPDATE} a={entities.RE_EXAMINATION}>
                {reExamination?.isRemind ? (
                  <Typography color={theme.palette.success.light}>{tReExaminationConstants("isRemind.true")}</Typography>
                ) : (
                  <Typography color={theme.palette.error.light}>{tReExaminationConstants("isRemind.false")}</Typography>
                )}
              </Can>
            </>
          );
        }
      },
      {
        id: columnsIds.action,
        label: "",
        minWidth: 40,
        render: (reExamination) => {
          // console.log("reExamination: ", reExamination);
          const scheduleSearchParams = {
            date: reExamination?.dateReExam
          };
          const scheduleSearchParamsUrl = qs.stringify(scheduleSearchParams);
          // {
          //    <IconButton
          //   sx={{ p: 0 }}
          //   onClick={() => {
          //     if (reExamination?.reExamOfBooking) {
          //       bookingAnInfoModal.setShow(true);
          //       bookingAnInfoModal.setData(reExamination?.reExamOfBooking);
          //     }
          //   }}
          // >
          //   <PreviewIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
          // </IconButton>
          // }
          return (
            <Box sx={{ ml: 2, mt: 0.5 }} component={Link} to={`${routeConfig.schedule}?${scheduleSearchParamsUrl}`}>
              <CalendarMonthIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
            </Box>
          );
        },
        action: true
      }
    ];

    return cols;
  }, [locale, showCols, reExaminations]);

  const [isReset, setIsReset] = useState(false);

  const { isRemind, dateReExam, limit } = watch();
  // delay 1000ms for search string
  const { debouncedObj: filterDebounce } = useObjDebounce(
    {
      // isApply,
      isRemind,
      // idStaffRemind,
      // dateRemind,
      dateReExam,
      limit
    },
    1000
  );

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
  }, [...Object.values(filterDebounce), isReset, sort]);

  // console.log("reExaminations: ", reExaminations);

  return (
    <>
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
          table={<DataTable rows={reExaminations} columns={columns} showCols={showCols} sort={sort} setSort={setSort} />}
          count={count}
          watch={watch}
          loadData={loadData}
          setValue={setValue}
        />
      </Box>

      {/* {bookingAnInfoModal.show && (
        <BookingAnInfoModal
          show={bookingAnInfoModal.show}
          setShow={bookingAnInfoModal.setShow}
          data={bookingAnInfoModal.data}
          setData={bookingAnInfoModal.setData}
        />
      )} */}
    </>
  );
}

export default ReExaminationList;
