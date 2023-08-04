import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";

export const useReExaminationFilterTranslation = () => {
  const { locale } = useAppConfigStore();

  const { t: tSelect } = useTranslation("reExaminationFeature", { keyPrefix: "ReExaminationList.select" });

  const [isApplyList, isApplyListObj] = useMemo(() => {
    const list = [
      {
        label: tSelect("isApply.true"),
        value: true
      },
      {
        label: tSelect("isApply.false"),
        value: false
      },
      {
        label: tSelect("isApply.all"),
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

  const [isRemindList, isRemindListObj] = useMemo(() => {
    const list = [
      {
        label: tSelect("isRemind.true"),
        value: true
      },
      {
        label: tSelect("isRemind.false"),
        value: false
      },
      {
        label: tSelect("isRemind.all"),
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
    isApplyList,
    isApplyListObj,
    isRemindList,
    isRemindListObj
  };
};
