import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { scheduleTypes } from "../../../entities/Schedule";

export const useScheduleTypesContantTranslation = () => {
  const { locale } = useAppConfigStore();

  const { t: tScheduleType } = useTranslation("scheduleEntity", { keyPrefix: "constants.types" });

  const [scheduleTypeContantList, scheduleTypeContantListObj] = useMemo(() => {
    const list = [
      {
        label: tScheduleType("offline"),
        value: scheduleTypes.TYPE_OFFLINE
      },
      {
        label: tScheduleType("online"),
        value: scheduleTypes.TYPE_ONLINE
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

  return [scheduleTypeContantList, scheduleTypeContantListObj];
};
