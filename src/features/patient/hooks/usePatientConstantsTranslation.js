import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { patientGenders } from "../../../entities/Patient";

export const usePatientGendersContantTranslation = () => {
  const { locale } = useAppConfigStore();

  const { t: tPatientGender } = useTranslation("patientEntity", { keyPrefix: "constants.genders" });

  const [patientGenderContantList, patientGenderContantListObj] = useMemo(() => {
    const list = [
      {
        label: tPatientGender("male"),
        value: patientGenders.MALE
      },
      {
        label: tPatientGender("female"),
        value: patientGenders.FEMALE
      },
      {
        label: tPatientGender("other"),
        value: patientGenders.OTHER
      }
      //   {
      //     label: tPatientGender("none"),
      //     value: ""
      //   }
    ];

    const listObj = list.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});

    return [list, listObj];
  }, [locale]);

  return [patientGenderContantList, patientGenderContantListObj];
};
