import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { userGenders, userStatuses } from "../../../entities/User";

export const useUserGendersContantTranslation = () => {
  const { locale } = useAppConfigStore();

  const { t: tUserGender } = useTranslation("userEntity", { keyPrefix: "constants.genders" });

  const [userGenderContantList, userGenderContantListObj] = useMemo(() => {
    const list = [
      {
        label: tUserGender("male"),
        value: userGenders.MALE
      },
      {
        label: tUserGender("female"),
        value: userGenders.FEMALE
      },
      {
        label: tUserGender("other"),
        value: userGenders.OTHER
      }
      //   {
      //     label: tUserGender("none"),
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

  return [userGenderContantList, userGenderContantListObj];
};

export const useUserStatusesContantTranslation = () => {
  const { locale } = useAppConfigStore();

  const { t: tUserStatus } = useTranslation("userEntity", { keyPrefix: "constants.statuses" });

  const [userStatusContantList, userStatusContantListObj] = useMemo(() => {
    const list = [
      {
        label: tUserStatus("block"),
        value: userStatuses.STATUS_BLOCK
      },
      {
        label: tUserStatus("unblock"),
        value: userStatuses.STATUS_UNBLOCK
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

  return [userStatusContantList, userStatusContantListObj];
};
