import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { usePatientFilterTranslation } from "./hooks";
import DataFilter, { inputComponentTypes } from "../../components/DataFilterTable/DataFilter";

function PatientFiltersForm() {
  const { locale } = useAppConfigStore();

  const { t: tFilter } = useTranslation("patientFeature", { keyPrefix: "PatientList.filter" });

  const filterForm = useFormContext();

  const { patientGenderList, patientGenderListObj } = usePatientFilterTranslation();

  const inputs = useMemo(() => {
    return [
      {
        label: tFilter("name"),
        name: "name"
      },
      {
        label: tFilter("phoneNumber"),
        name: "phoneNumber"
      },
      {
        label: tFilter("gender"),
        name: "gender",
        inputComponentType: inputComponentTypes.SELECT,
        list: patientGenderList,
        listObj: patientGenderListObj
      }
      // {
      //   label: tFilter("healthInsurance"),
      //   name: "healthInsurance"
      // }
    ];
  }, [locale]);

  return <DataFilter inputs={inputs} filterForm={filterForm} />;
}

export default PatientFiltersForm;
