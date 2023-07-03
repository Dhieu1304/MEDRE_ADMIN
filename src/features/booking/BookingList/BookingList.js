import { useTranslation } from "react-i18next";
import qs from "query-string";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { Preview as PreviewIcon, Search as SearchIcon } from "@mui/icons-material";
import formatDate from "date-and-time";
import CustomOverlay from "../../../components/CustomOverlay/CustomOverlay";
import ListPageTop from "../../../components/ListPageTop";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { columnsIds, createDefaultValues, initialShowCols } from "./utils";
import bookingServices from "../../../services/bookingServices";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import useObjDebounce from "../../../hooks/useObjDebounce";
import BookingFiltersForm from "./BookingFiltersForm";
import ListPageTableWrapper from "../../../components/ListPageTableWrapper";
import ListPageAction from "../../../components/ListPageAction/ListPageAction";
import { useCustomModal } from "../../../components/CustomModal";
import BookingAnInfoModal from "../components/BookingAnInfoModal";
import CopyButton from "../../../components/CopyButton";
import { bookingStatuses as bookingStatusesConstans } from "../../../entities/Booking";
import DataTable from "../../components/DataFilterTable/DataTable";
import routeConfig from "../../../config/routeConfig";
import { getSortValue } from "../../../utils/objectUtil";

function BookingList() {
  const { locale } = useAppConfigStore();
  const [isFirst, setIsFirst] = useState(true);
  const [countRender, setCountRender] = useState(1);

  const [bookings, setBookings] = useState([]);
  const [count, setCount] = useState(0);
  const [sort, setSort] = useState({
    sortBy: columnsIds.date,
    isAsc: true
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, fetchApi } = useFetchingStore();

  // functions for multilingual use

  const theme = useTheme();

  const { t } = useTranslation("bookingFeature", { keyPrefix: "BookingList" });
  const { t: tBooking } = useTranslation("bookingEntity", { keyPrefix: "properties" });
  const { t: tBookingStatuses } = useTranslation("bookingEntity", { keyPrefix: "constants.statuses" });
  const { t: tBookingPaymentStatuses } = useTranslation("bookingEntity", { keyPrefix: "constants.paymentStatuses" });

  const bookingAnInfoModal = useCustomModal();

  // state is used to represent the visibility of the Menu
  // (This menu allows the patient to hide or show custom columns)
  const [showTableColsMenu, setShowTableColsMenu] = useState(null);

  /*
    The keys of this object represent column-by-column visibility
    We will hide address, healthInsurance for the first time
  */
  const [showCols, setShowCols] = useState({
    ...initialShowCols,
    patientPhoneNumber: false,
    expertise: false
  });

  const columns = useMemo(
    () => [
      {
        id: columnsIds.patientName,
        label: tBooking(columnsIds.patientName),
        minWidth: 100,
        render: (booking) => booking?.bookingOfPatient?.name,
        fixed: true
      },
      {
        id: columnsIds.patientPhoneNumber,
        label: tBooking(columnsIds.patientPhoneNumber),
        minWidth: 100,
        hide: !showCols[columnsIds.patientPhoneNumber],
        render: (booking) => booking?.bookingOfPatient?.phoneNumber
      },
      {
        id: columnsIds.doctorName,
        label: tBooking(columnsIds.doctorName),
        minWidth: 100,
        hide: !showCols[columnsIds.doctorName],
        render: (booking) => booking?.bookingSchedule?.scheduleOfStaff?.name
      },
      {
        id: columnsIds.date,
        haveSortIcon: true,
        label: tBooking(columnsIds.date),
        minWidth: 100,
        hide: !showCols[columnsIds.date],
        render: (booking) => booking?.date && formatDate.format(new Date(booking?.date), "DD/MM/YYYY")
      },
      {
        id: columnsIds.time,
        label: tBooking(columnsIds.time),
        minWidth: 100,
        hide: !showCols[columnsIds.time],
        render: (booking) => (
          <Typography fontWeight={500} textAlign="center" fontSize={16}>
            {`${booking?.bookingTimeSchedule?.timeStart?.split(":")[0]}:${
              booking?.bookingTimeSchedule?.timeStart?.split(":")[1]
            }`}{" "}
            -{" "}
            {`${booking?.bookingTimeSchedule?.timeEnd?.split(":")[0]}:${
              booking?.bookingTimeSchedule?.timeEnd?.split(":")[1]
            }`}
          </Typography>
        )
      },
      {
        id: columnsIds.type,
        label: tBooking(columnsIds.type),
        minWidth: 100,
        hide: !showCols[columnsIds.type],
        render: (booking) => booking?.bookingSchedule?.type
      },
      {
        id: columnsIds.expertise,
        label: tBooking(columnsIds.expertise),
        minWidth: 100,
        hide: !showCols[columnsIds.expertise],
        render: (booking) => booking?.bookingSchedule?.scheduleExpertise?.name
      },
      {
        id: columnsIds.ordinalNumber,
        haveSortIcon: true,
        label: tBooking(columnsIds.ordinalNumber),
        minWidth: 100,
        hide: !showCols[columnsIds.ordinalNumber],
        render: (booking) => booking?.ordinalNumber
      },
      {
        id: columnsIds.status,
        haveSortIcon: true,
        label: tBooking(columnsIds.status),
        minWidth: 140,
        hide: !showCols[columnsIds.status],
        render: (booking) => {
          switch (booking?.bookingStatus) {
            case bookingStatusesConstans.BOOKED:
              return (
                <Typography
                  sx={{
                    width: "100%",
                    fontSize: 14,
                    color: theme.palette.success.light
                  }}
                >
                  {tBookingStatuses("booked")}
                </Typography>
              );
            case bookingStatusesConstans.CANCELED:
              return (
                <Typography
                  sx={{
                    width: "100%",
                    fontSize: 14,
                    color: theme.palette.error.light
                  }}
                >
                  {tBookingStatuses("cancel")}
                </Typography>
              );
            case bookingStatusesConstans.WAITING:
            default:
              return (
                <Typography
                  sx={{
                    width: "100%",
                    fontSize: 14,
                    color: theme.palette.warning.light
                  }}
                >
                  {tBookingStatuses("waiting")}
                </Typography>
              );
          }
        }
      },
      {
        id: columnsIds.paymentStatus,
        haveSortIcon: true,
        label: tBooking(columnsIds.paymentStatus),
        minWidth: 120,
        hide: !showCols[columnsIds.paymentStatus],
        render: (booking) => {
          if (booking?.isPayment)
            return (
              <Typography
                sx={{
                  width: "100%",
                  fontSize: 14,
                  color: theme.palette.success.light
                }}
              >
                {tBookingPaymentStatuses("paid")}
              </Typography>
            );

          return (
            <Typography
              sx={{
                width: "100%",
                fontSize: 14,
                color: theme.palette.warning.light
              }}
            >
              {tBookingPaymentStatuses("unpaid")}
            </Typography>
          );
        }
      },

      {
        id: columnsIds.action,
        label: "",
        minWidth: 100,
        render: (booking) => {
          const bookingPath = routeConfig.booking;
          return (
            <>
              <Box sx={{ ml: 2 }} component={Link} to={`${bookingPath}/${booking?.id}`}>
                <SearchIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
              </Box>

              <IconButton
                onClick={() => {
                  if (booking) {
                    bookingAnInfoModal.setShow(true);
                    bookingAnInfoModal.setData(booking);
                  }
                }}
              >
                <PreviewIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
              </IconButton>

              <CopyButton content={booking?.id} />
            </>
          );
        },
        action: true
      }
    ],
    [locale, showCols, bookings]
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

  const { patientPhoneNumber, userId, patientId, doctorId, staffBookingId, staffCancelId, type, isPayment } = watch();
  // delay 1000ms for search string
  const { debouncedObj: searchDebounce } = useObjDebounce(
    {
      patientPhoneNumber,
      userId,
      patientId,
      doctorId,
      staffBookingId,
      staffCancelId,
      type,
      isPayment
    },
    1000
  );

  const { from, to, bookingStatuses, limit } = watch();
  // delay 1000ms for selection and datetime
  const { debouncedObj: filterDebounce } = useObjDebounce(
    {
      from,
      to,
      bookingStatuses,
      limit
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
          date: "date",
          ordinalNumber: "ordinal_number",
          status: "booking_status",
          paymentStatus: "is_payment"
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
      const res = await bookingServices.getBookingList(paramsObj);

      let countData = 0;
      let bookingsData = [];

      if (res.success) {
        bookingsData = res?.bookings || [];
        countData = res?.count;
        setBookings(bookingsData);
        setCount(countData);

        return { ...res };
      }
      setBookings([]);
      setCount(0);
      return { ...res };
    });
  };

  useEffect(() => {
    // console.log("isReset change");

    if (isFirst) {
      setIsFirst(false);
      setCountRender((prev) => prev + 1);
      return;
    }

    // Trong 2 lần useEffect đầu tiên thì ta lấy page theo watch().page (lấy từ location.search)
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
    <>
      <CustomOverlay open={isLoading} />
      <Box>
        <ListPageTop
          title={t("title")}
          filterFormNode={
            <FormProvider {...filterForm}>
              <BookingFiltersForm />
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
          table={<DataTable rows={bookings} columns={columns} showCols={showCols} sort={sort} setSort={setSort} />}
          count={count}
          watch={watch}
          loadData={loadData}
          setValue={setValue}
        />
      </Box>

      {bookingAnInfoModal.show && (
        <BookingAnInfoModal
          show={bookingAnInfoModal.show}
          setShow={bookingAnInfoModal.setShow}
          data={bookingAnInfoModal.data}
          setData={bookingAnInfoModal.setData}
        />
      )}
    </>
  );
}

export default BookingList;
