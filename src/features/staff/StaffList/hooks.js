import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { staffGenders, staffRoles } from "../../../entities/Staff";

export const useStaffFilterTranslation = ({ expertises }) => {
  const { locale } = useAppConfigStore();

  const { t: tSelect } = useTranslation("staffFeature", { keyPrefix: "StaffList.select" });

  const [staffRoleList, staffRoleListObj] = useMemo(() => {
    const list = [
      {
        label: tSelect("roles.admin"),
        value: staffRoles.ROLE_ADMIN
      },
      {
        label: tSelect("roles.doctor"),
        value: staffRoles.ROLE_DOCTOR
      },
      {
        label: tSelect("roles.nurse"),
        value: staffRoles.ROLE_NURSE
      },
      {
        label: tSelect("roles.customerService"),
        value: staffRoles.ROLE_CUSTOMER_SERVICE
      },
      {
        label: tSelect("roles.all"),
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

  const [staffGenderList, staffGenderListObj] = useMemo(() => {
    const list = [
      {
        label: tSelect("genders.male"),
        value: staffGenders.MALE
      },
      {
        label: tSelect("genders.female"),
        value: staffGenders.FEMALE
      },
      {
        label: tSelect("genders.other"),
        value: staffGenders.OTHER
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

  const [staffTypeList, staffTypeListObj] = useMemo(() => {
    const list = [
      {
        label: tSelect("types.offline"),
        value: "Offline"
      },
      {
        label: tSelect("types.online"),
        value: "Online"
      },
      {
        label: tSelect("types.all"),
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

  const [staffStatusList, staffStatusListObj] = useMemo(() => {
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

  const [expertisesList, expertiseListObj] = useMemo(() => {
    const list = expertises?.map((expertise) => {
      return {
        value: expertise?.id,
        label: expertise?.name
      };
    });

    expertises.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.id]: cur
      };
    }, {});

    const listObj = list.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});

    return [list, listObj];
  }, [expertises]);

  return {
    staffRoleList,
    staffRoleListObj,
    staffGenderList,
    staffGenderListObj,
    staffTypeList,
    staffTypeListObj,
    staffStatusList,
    staffStatusListObj,
    expertisesList,
    expertiseListObj
  };
};
