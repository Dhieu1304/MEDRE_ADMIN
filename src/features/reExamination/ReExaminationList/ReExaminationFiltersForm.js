import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { useReExaminationFilterTranslation } from "./hooks";
import DataFilter, { inputComponentTypes } from "../../components/DataFilterTable/DataFilter";

function ReExaminationFiltersForm() {
  const { locale } = useAppConfigStore();
  const filterForm = useFormContext();

  const { t: tFilter } = useTranslation("reExaminationFeature", { keyPrefix: "ReExaminationList.filter" });

  const { isRemindList, isRemindListObj } = useReExaminationFilterTranslation();

  const inputs = useMemo(() => {
    return [
      {
        label: tFilter("dateReExam"),
        name: "dateReExam",
        type: "date"
      },
      {
        label: tFilter("isRemind"),
        name: "isRemind",
        inputComponentType: inputComponentTypes.SELECT,
        list: isRemindList,
        listObj: isRemindListObj
      }
    ];
  }, [locale]);

  return <DataFilter inputs={inputs} filterForm={filterForm} />;
}

export default ReExaminationFiltersForm;
