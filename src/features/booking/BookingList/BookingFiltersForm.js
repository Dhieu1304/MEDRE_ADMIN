import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { useBookingFilterTranslation } from "./hooks";
import DataFilter, { inputComponentTypes } from "../../components/DataFilterTable/DataFilter";

function BookingFiltersForm() {
  const { locale } = useAppConfigStore();
  const filterForm = useFormContext();

  const { t: tFilter } = useTranslation("bookingFeature", { keyPrefix: "BookingList.filter" });

  const { isPaymentList, isPaymentListObj, bookingTypeList, bookingTypeListObj, bookingStatusList, bookingStatusListObj } =
    useBookingFilterTranslation();

  const inputs = useMemo(() => {
    return [
      { name: "patientPhoneNumber", label: tFilter("patientPhoneNumber") },
      { name: "userId", label: tFilter("userId") },
      { name: "patientId", label: tFilter("patientId") },
      { name: "doctorId", label: tFilter("doctorId") },
      { name: "staffBookingId", label: tFilter("staffBookingId") },
      { name: "staffCancelId", label: tFilter("staffCancelId") },

      {
        label: tFilter("isPayment"),
        name: "isPayment",

        inputComponentType: inputComponentTypes.SELECT,
        list: isPaymentList,
        listObj: isPaymentListObj
      },
      {
        label: tFilter("type"),
        name: "type",

        inputComponentType: inputComponentTypes.SELECT,
        list: bookingTypeList,
        listObj: bookingTypeListObj
      },

      {
        label: tFilter("bookingStatuses"),
        name: "bookingStatuses",
        inputComponentType: inputComponentTypes.MULTI_SELECT,
        list: bookingStatusList,
        listObj: bookingStatusListObj
      },

      {
        label: tFilter("bookingRange"),
        inputComponentType: inputComponentTypes.DATE_RANGE,
        name: "fromTo",
        fromDateName: "from",
        toDateName: "to",
        fromDateLabel: tFilter("from"),
        toDateLabel: tFilter("to"),
        previewLabel: tFilter("bookingRangePreview")
      }
    ];
  }, [locale]);

  return <DataFilter inputs={inputs} filterForm={filterForm} />;
}

export default BookingFiltersForm;
