import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { staffGenders, staffRoles, staffStatuses } from "../../../entities/Staff";

export const useStaffGendersContantTranslation = () => {
  const { locale } = useAppConfigStore();

  const { t: tStaffGender } = useTranslation("staffEntity", { keyPrefix: "constants.genders" });

  const [staffGenderContantList, staffGenderContantListObj] = useMemo(() => {
    const list = [
      {
        label: tStaffGender("male"),
        value: staffGenders.MALE
      },
      {
        label: tStaffGender("female"),
        value: staffGenders.FEMALE
      },
      {
        label: tStaffGender("other"),
        value: staffGenders.OTHER
      }
      //   {
      //     label: tStaffGender("none"),
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

  return [staffGenderContantList, staffGenderContantListObj];
};

export const useStaffRolesContantTranslation = () => {
  const { locale } = useAppConfigStore();

  const { t: tStaffRole } = useTranslation("staffEntity", { keyPrefix: "constants.roles" });

  const [staffRoleContantList, staffRoleContantListObj] = useMemo(() => {
    const list = [
      {
        label: tStaffRole("admin"),
        value: staffRoles.ROLE_ADMIN
      },
      {
        label: tStaffRole("doctor"),
        value: staffRoles.ROLE_DOCTOR
      },
      {
        label: tStaffRole("nurse"),
        value: staffRoles.ROLE_NURSE
      },
      {
        label: tStaffRole("customerService"),
        value: staffRoles.ROLE_CUSTOMER_SERVICE
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

  return [staffRoleContantList, staffRoleContantListObj];
};

export const useStaffRolesContantToEditRoleTranslation = () => {
  const { locale } = useAppConfigStore();

  const { t: tStaffRole } = useTranslation("staffEntity", { keyPrefix: "constants.roles" });

  const [staffRoleContantList, staffRoleContantListObj] = useMemo(() => {
    const list = [
      {
        label: tStaffRole("doctor"),
        value: staffRoles.ROLE_DOCTOR
      },
      {
        label: tStaffRole("nurse"),
        value: staffRoles.ROLE_NURSE
      },
      {
        label: tStaffRole("customerService"),
        value: staffRoles.ROLE_CUSTOMER_SERVICE
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

  return [staffRoleContantList, staffRoleContantListObj];
};

export const useStaffStatusesContantTranslation = () => {
  const { locale } = useAppConfigStore();

  const { t: tStaffStatus } = useTranslation("staffEntity", { keyPrefix: "constants.statuses" });

  const [staffStatusContantList, staffStatusContantListObj] = useMemo(() => {
    const list = [
      {
        label: tStaffStatus("block"),
        value: staffStatuses.STATUS_BLOCK
      },
      {
        label: tStaffStatus("unblock"),
        value: staffStatuses.STATUS_UNBLOCK
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

  return [staffStatusContantList, staffStatusContantListObj];
};
