import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { bookingPaymentStatuses, bookingStatuses } from "../../../entities/Booking/constant";
import { scheduleTypes } from "../../../entities/Schedule/constant";

export const useBookingFilterTranslation = () => {
  const { locale } = useAppConfigStore();
  const { t: tSelect } = useTranslation("bookingFeature", { keyPrefix: "BookingList.select" });

  const [isPaymentList, isPaymentListObj] = useMemo(() => {
    const list = [
      {
        label: tSelect("isPayment.paid"),
        value: bookingPaymentStatuses.PAID
      },
      {
        label: tSelect("isPayment.unpaid"),
        value: bookingPaymentStatuses.UNPAID
      },
      {
        label: tSelect("isPayment.all"),
        value: ""
      }
    ];

    const listObj = list.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});

    return [list, listObj];
  }, [locale]);

  const [bookingTypeList, bookingTypeListObj] = useMemo(() => {
    const list = [
      {
        label: tSelect("types.offline"),
        value: scheduleTypes.TYPE_OFFLINE
      },
      {
        label: tSelect("types.online"),
        value: scheduleTypes.TYPE_ONLINE
      },
      {
        label: tSelect("types.all"),
        value: ""
      }
    ];

    const listObj = list.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});

    return [list, listObj];
  }, [locale]);

  const [bookingStatusList, bookingStatusListObj] = useMemo(() => {
    const list = [
      {
        label: tSelect("statuses.waiting"),
        value: bookingStatuses.WAITING
      },
      {
        label: tSelect("statuses.booked"),
        value: bookingStatuses.BOOKED
      },
      {
        label: tSelect("statuses.cancel"),
        value: bookingStatuses.CANCELED
      }
    ];

    const listObj = list.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});

    return [list, listObj];
  }, [locale]);

  return {
    isPaymentList,
    isPaymentListObj,
    bookingTypeList,
    bookingTypeListObj,
    bookingStatusList,
    bookingStatusListObj
  };
};
