import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { useBookingFilterTranslation } from "./hooks";
import DataFilter, { inputComponentTypes } from "../../components/DataFilterTable/DataFilter";
import { useAuthStore } from "../../../store/AuthStore";
import { fixedFiltersByStaffRole } from "./utils";

function BookingFiltersForm() {
  const { locale } = useAppConfigStore();
  const filterForm = useFormContext();

  const { t: tFilter } = useTranslation("bookingFeature", { keyPrefix: "BookingList.filter" });

  const authStore = useAuthStore();
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
    ].filter((input) => {
      const hideFilters = fixedFiltersByStaffRole(authStore.staff);
      // console.log("hideFilters: ", hideFilters);

      if (input.inputComponentType === inputComponentTypes.DATE_RANGE) {
        if (input?.fromDateName in hideFilters || input?.toDateLabel in hideFilters) {
          return false;
        }
        return true;
      }
      // if (hideFilters[input?.name] !== undefined) {
      //   return false;
      // }
      // if (hideFilters?.hasOwnProperty(input?.name)) {
      if (input?.name in hideFilters) {
        return false;
      }

      return true;
    });
  }, [locale]);

  return <DataFilter inputs={inputs} filterForm={filterForm} />;
}

export default BookingFiltersForm;
