import PropTypes from "prop-types";

import { useFormContext } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useStaffFilterTranslation } from "./hooks";
import { useAppConfigStore } from "../../../store/AppConfigStore";

import DataFilter, { inputComponentTypes } from "../../components/DataFilterTable/DataFilter";

function StaffFiltersForm({ expertises }) {
  const filterForm = useFormContext();

  const { locale } = useAppConfigStore();

  const { t: tFilter } = useTranslation("staffFeature", { keyPrefix: "StaffList.filter" });

  const {
    staffRoleList,
    staffRoleListObj,
    // staffGenderList,
    // staffGenderListObj,
    // staffTypeList,
    // staffTypeListObj,
    staffStatusList,
    staffStatusListObj,
    expertisesList,
    expertiseListObj
  } = useStaffFilterTranslation({
    expertises
  });

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
        label: tFilter("phone"),
        name: "phoneNumber"
      },
      // {
      //   label: tFilter("username"),
      //   name: "username"
      // },
      // {
      //   label: tFilter("gender"),
      //   name: "gender",
      //   inputComponentType: inputComponentTypes.SELECT,
      //   list: staffGenderList,
      //   listObj: staffGenderListObj
      // },
      {
        label: tFilter("status"),
        name: "status",
        inputComponentType: inputComponentTypes.SELECT,
        list: staffStatusList,
        listObj: staffStatusListObj
      },
      {
        label: tFilter("role"),
        name: "role",
        inputComponentType: inputComponentTypes.SELECT,
        list: staffRoleList,
        listObj: staffRoleListObj
      },
      {
        label: tFilter("expertises"),
        name: "expertises",
        inputComponentType: inputComponentTypes.MULTI_SELECT,
        list: expertisesList,
        listObj: expertiseListObj
      }
      // {
      //   label: tFilter("address"),
      //   name: "address"
      // },
      // {
      //   label: tFilter("healthInsurance"),
      //   name: "healthInsurance"
      // },
      // {
      //   label: tFilter("schedules"),
      //   inputComponentType: inputComponentTypes.DATE_RANGE,
      //   name: "fromTo",
      //   fromDateName: "from",
      //   toDateName: "to",
      //   fromDateLabel: tFilter("from"),
      //   toDateLabel: tFilter("to"),
      //   previewLabel: tFilter("scheduleFromToPreview")
      // },
      // {
      //   label: tFilter("type"),
      //   name: "type",
      //   inputComponentType: inputComponentTypes.SELECT,
      //   list: staffTypeList,
      //   listObj: staffTypeListObj
      // }
    ];
  }, [locale, expertises]);

  return <DataFilter inputs={inputs} filterForm={filterForm} />;
}

StaffFiltersForm.propTypes = {
  expertises: PropTypes.array.isRequired
};

export default StaffFiltersForm;
