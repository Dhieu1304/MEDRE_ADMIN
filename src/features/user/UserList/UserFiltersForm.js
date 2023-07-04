import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { useUserFilterTranslation } from "./hooks";
import DataFilter, { inputComponentTypes } from "../../components/DataFilterTable/DataFilter";

function UserFiltersForm() {
  const { locale } = useAppConfigStore();

  const { t: tFilter } = useTranslation("userFeature", { keyPrefix: "UserList.filter" });

  const filterForm = useFormContext();

  const { userGenderList, userGenderListObj, userStatusList, userStatusListObj } = useUserFilterTranslation();

  const inputs = useMemo(() => {
    return [
      {
        label: tFilter("name"),
        name: "name"
      },
      {
        label: tFilter("email"),
        name: "email",
        type: "email"
      },
      {
        label: tFilter("phoneNumber"),
        name: "phoneNumber"
      },
      {
        label: tFilter("gender"),
        name: "gender",
        inputComponentType: inputComponentTypes.SELECT,
        list: userGenderList,
        listObj: userGenderListObj
      },
      {
        label: tFilter("status"),
        name: "status",
        inputComponentType: inputComponentTypes.SELECT,
        list: userStatusList,
        listObj: userStatusListObj
      }

      // {
      //   label: tFilter("healthInsurance"),
      //   name: "healthInsurance"
      // }
    ];
  }, [locale]);

  return <DataFilter inputs={inputs} filterForm={filterForm} gridLg={3} />;
}

export default UserFiltersForm;
