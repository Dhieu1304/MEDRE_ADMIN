import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { timeOffSessions } from "../../../entities/TimeOff";

export const useTimeOffSessionsContantTranslation = () => {
  const { locale } = useAppConfigStore();

  const { t: tTimeOffSession } = useTranslation("timeOffEntity", { keyPrefix: "constants.sessions" });

  const [timeOffSessionContantList, timeOffSessionContantListObj] = useMemo(() => {
    const list = [
      {
        label: tTimeOffSession("morning"),
        value: timeOffSessions.MORNING
      },
      {
        label: tTimeOffSession("afternoon"),
        value: timeOffSessions.AFFTERNOON
      },
      {
        label: tTimeOffSession("evening"),
        value: timeOffSessions.EVENING
      },
      {
        label: tTimeOffSession("wholeDay"),
        value: timeOffSessions.WHOLE_DAY
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

  return [timeOffSessionContantList, timeOffSessionContantListObj];
};
