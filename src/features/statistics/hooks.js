import { useMemo } from "react";
import { useAppConfigStore } from "../../store/AppConfigStore";
import { statisticsFilterTypes } from "../../entities/statistics";

export const useStatisticsTranslation = (time, t) => {
  const { locale } = useAppConfigStore();
  const [chartTitle, tableTitle] = useMemo(() => {
    switch (time) {
      case statisticsFilterTypes.WEEK:
        return [t("chart.title.week"), t("table.title.week")];
      case statisticsFilterTypes.MONTH:
        return [t("chart.title.month"), t("table.title.month")];
      case statisticsFilterTypes.YEAR:
        return [t("chart.title.year"), t("table.title.year")];
      case statisticsFilterTypes.DAY:
      default:
        return [t("chart.title.day"), t("table.title.day")];
    }
  }, [time, locale]);

  return [chartTitle, tableTitle];
};
