import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { scheduleSessions, scheduleTypes } from "../../../entities/Schedule";

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

export const useScheduleSessionsContantTranslation = () => {
  const { locale } = useAppConfigStore();

  const { t: tScheduleSession } = useTranslation("scheduleEntity", { keyPrefix: "constants.sessions" });

  const [scheduleSessionContantList, scheduleSessionContantListObj] = useMemo(() => {
    const list = [
      {
        label: tScheduleSession("morning"),
        value: scheduleSessions.MORNING
      },
      {
        label: tScheduleSession("afternoon"),
        value: scheduleSessions.AFFTERNOON
      },
      {
        label: tScheduleSession("wholeDay"),
        value: scheduleSessions.WHOLE_DAY
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

  return [scheduleSessionContantList, scheduleSessionContantListObj];
};
