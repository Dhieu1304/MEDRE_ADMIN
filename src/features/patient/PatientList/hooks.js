import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { patientGenders } from "../../../entities/Patient";

export const usePatientFilterTranslation = () => {
  const { locale } = useAppConfigStore();

  const { t: tSelect } = useTranslation("patientFeature", { keyPrefix: "PatientList.select" });

  const [patientGenderList, patientGenderListObj] = useMemo(() => {
    const list = [
      {
        label: tSelect("genders.male"),
        value: patientGenders.MALE
      },
      {
        label: tSelect("genders.female"),
        value: patientGenders.FEMALE
      },
      {
        label: tSelect("genders.other"),
        value: patientGenders.OTHER
      },
      {
        label: tSelect("genders.all"),
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

  return {
    patientGenderList,
    patientGenderListObj
  };
};
