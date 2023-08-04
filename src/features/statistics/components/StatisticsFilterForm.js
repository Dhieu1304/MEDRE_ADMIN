import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import DataFilter from "../../components/DataFilterTable/DataFilter";

function StatisticsFilterForm() {
  const filterForm = useFormContext();

  const { locale } = useAppConfigStore();
  const { t: tFilter } = useTranslation("statisticsFeature", { keyPrefix: "StatisticsFilterForm.filter" });

  const inputs = useMemo(() => {
    return [
      {
        label: tFilter("from"),
        name: "from",
        type: "date"
      },
      {
        label: tFilter("to"),
        name: "to",
        type: "date"
      }
    ];
  }, [locale]);

  return <DataFilter inputs={inputs} filterForm={filterForm} />;
}

export default StatisticsFilterForm;
