import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { userGenders } from "../../../entities/User";

export const useUserFilterTranslation = () => {
  const { locale } = useAppConfigStore();

  const { t: tSelect } = useTranslation("userFeature", { keyPrefix: "UserList.select" });

  const [userGenderList, userGenderListObj] = useMemo(() => {
    const list = [
      {
        label: tSelect("genders.male"),
        value: userGenders.MALE
      },
      {
        label: tSelect("genders.female"),
        value: userGenders.FEMALE
      },
      {
        label: tSelect("genders.other"),
        value: userGenders.OTHER
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

  const [userStatusList, userStatusListObj] = useMemo(() => {
    const list = [
      {
        label: tSelect("statuses.block"),
        value: true
      },
      {
        label: tSelect("statuses.unblock"),
        value: false
      },
      {
        label: tSelect("statuses.all"),
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
    userGenderList,
    userGenderListObj,
    userStatusList,
    userStatusListObj
  };
};
