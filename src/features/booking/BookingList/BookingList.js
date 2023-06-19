import { useTranslation } from "react-i18next";
import qs from "query-string";
import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import CustomOverlay from "../../../components/CustomOverlay/CustomOverlay";
import ListPageTop from "../../../components/ListPageTop";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { columnsIds, createDefaultValues, initialShowCols } from "./utils";
import bookingServices from "../../../services/bookingServices";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import useObjDebounce from "../../../hooks/useObjDebounce";
import BookingFiltersForm from "./BookingFiltersForm";
import ListPageTableWrapper from "../../../components/ListPageTableWrapper";
import BookingTable from "./BookingTable";
import ListPageAction from "../../../components/ListPageAction/ListPageAction";

function BookingList() {
  const { locale } = useAppConfigStore();
  const [isFirst, setIsFirst] = useState(true);
  const [countRender, setCountRender] = useState(1);

  const [bookings, setBookings] = useState([]);
  const [count, setCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, fetchApi } = useFetchingStore();

  // functions for multilingual use

  const { t } = useTranslation("bookingFeature", { keyPrefix: "BookingList" });
  const { t: tBooking } = useTranslation("bookingEntity", { keyPrefix: "properties" });

  // state is used to represent the visibility of the Menu
  // (This menu allows the patient to hide or show custom columns)
  const [showTableColsMenu, setShowTableColsMenu] = useState(null);

  /*
    The keys of this object represent column-by-column visibility
    We will hide address, healthInsurance for the first time
  */
  const [showCols, setShowCols] = useState({
    ...initialShowCols
  });

  const columns = useMemo(
    () => [
      {
        id: columnsIds.patientName,
        label: tBooking(columnsIds.patientName),
        minWidth: 100
      },
      {
        id: columnsIds.patientPhoneNumber,
        label: tBooking(columnsIds.patientPhoneNumber),
        minWidth: 100,
        hide: !showCols[columnsIds.patientPhoneNumber]
      },
      {
        id: columnsIds.doctorName,
        label: tBooking(columnsIds.doctorName),
        minWidth: 100,
        hide: !showCols[columnsIds.doctorName]
      },
      {
        id: columnsIds.date,
        label: tBooking(columnsIds.date),
        minWidth: 100,
        hide: !showCols[columnsIds.date]
      },
      {
        id: columnsIds.time,
        label: tBooking(columnsIds.time),
        minWidth: 100,
        hide: !showCols[columnsIds.time]
      },
      {
        id: columnsIds.type,
        label: tBooking(columnsIds.type),
        minWidth: 100,
        hide: !showCols[columnsIds.type]
      },
      {
        id: columnsIds.expertise,
        label: tBooking(columnsIds.expertise),
        minWidth: 100,
        hide: !showCols[columnsIds.expertise]
      },
      {
        id: columnsIds.ordinalNumber,
        label: tBooking(columnsIds.ordinalNumber),
        minWidth: 100,
        hide: !showCols[columnsIds.ordinalNumber]
      },
      {
        id: columnsIds.status,
        label: tBooking(columnsIds.status),
        minWidth: 100,
        hide: !showCols[columnsIds.status]
      },
      {
        id: columnsIds.paymentStatus,
        label: tBooking(columnsIds.paymentStatus),
        minWidth: 100,
        hide: !showCols[columnsIds.paymentStatus]
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
    const paramsObj = {
      ...watch(),
      page
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
  }, [...Object.values(filterDebounce), ...Object.values(searchDebounce), isReset]);

  return (
    <Box>
      <CustomOverlay open={isLoading} />

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
        table={<BookingTable bookings={bookings} columns={columns} showCols={showCols} />}
        count={count}
        watch={watch}
        loadData={loadData}
        setValue={setValue}
      />
    </Box>
  );
}

export default BookingList;
