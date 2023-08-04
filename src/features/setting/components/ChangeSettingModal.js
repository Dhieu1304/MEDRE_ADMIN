import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import CustomModal from "../../../components/CustomModal";

import { useFetchingStore } from "../../../store/FetchingApiStore";
import settingServices from "../../../services/settingServices";
import CustomInput from "../../../components/CustomInput/CustomInput";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { settingNames } from "../../../entities/Setting";

function ChangeSettingModal({ show, setShow, data, setData, handleAfterEditSetting }) {
  const { handleSubmit, control, trigger } = useForm({
    mode: "onChange",
    defaultValues: {
      value: data?.value
    },
    criteriaMode: "all"
  });

  const { locale } = useAppConfigStore();
  const { t } = useTranslation("settingFeature", { keyPrefix: "ChangeSettingModal" });
  const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });

  const { t: tSettingNames } = useTranslation("settingEntity", { keyPrefix: "constants.names" });
  const { t: tSettingUnits } = useTranslation("settingEntity", { keyPrefix: "constants.units" });
  const { t: tSettingMaintainGuides } = useTranslation("settingEntity", { keyPrefix: "constants.maintainGuides" });

  const settingLabelObj = useMemo(() => {
    return {
      maintain: {
        label: tSettingNames("maintain"),
        unit: tSettingUnits("maintain")
      },
      bookAdvanceDay: {
        label: tSettingNames("bookAdvanceDay"),
        unit: tSettingUnits("bookAdvanceDay")
      },
      bookAfterDay: {
        label: tSettingNames("bookAfterDay"),
        unit: tSettingUnits("bookAfterDay")
      },
      createScheduleAdvanceDay: {
        label: tSettingNames("createScheduleAdvanceDay"),
        unit: tSettingUnits("createScheduleAdvanceDay")
      },
      cancelOnlineBookingAfterMinute: {
        label: tSettingNames("cancelOnlineBookingAfterMinute"),
        unit: tSettingUnits("cancelOnlineBookingAfterMinute")
      }
    };
  }, [locale]);

  const { fetchApi } = useFetchingStore();

  const handleEditSetting = async ({ value }) => {
    await fetchApi(async () => {
      const id = data?.id;
      const res = await settingServices.editSetting({ id, value });

      if (res?.success) {
        setShow(false);
        setData({});
        if (handleAfterEditSetting) await handleAfterEditSetting();
        return { ...res };
      }
      return { ...res };
    });
  };

  const rules =
    data?.name === settingNames.maintain
      ? {
          min: {
            value: 0,
            message: tInputValidation("gt", {
              left: settingLabelObj[data?.name]?.label,
              right: 0
            })
          },
          max: {
            value: 1,
            message: tInputValidation("lt", {
              left: settingLabelObj[data?.name]?.label,
              right: 1
            })
          }
        }
      : {
          min: {
            value: 0,
            message: tInputValidation("gt", {
              left: settingLabelObj[data?.name]?.label,
              right: 0
            })
          }
        };

  const renderGuide = () => {
    // console.log("data: ", data);
    if (data?.name === settingNames.maintain) {
      return (
        <Box>
          <Typography sx={{}}>- {tSettingMaintainGuides("true")}: 1</Typography>
          <Typography sx={{}}>- {tSettingMaintainGuides("false")}: 0</Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <CustomModal
      show={show}
      setShow={setShow}
      data={data}
      setData={setData}
      title={t("title")}
      submitBtnLabel={t("button.save")}
      onSubmit={handleSubmit(handleEditSetting)}
      width={500}
    >
      <Box
        sx={{
          width: "100%"
        }}
      >
        <CustomInput
          control={control}
          rules={{
            required: tInputValidation("required"),
            ...rules
          }}
          label={settingLabelObj[data?.name]?.label}
          trigger={trigger}
          name="value"
          type="number"
        />

        {renderGuide()}
      </Box>
    </CustomModal>
  );
}

ChangeSettingModal.defaultProps = {
  handleAfterEditSetting: undefined
};

ChangeSettingModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  handleAfterEditSetting: PropTypes.func
};

export default ChangeSettingModal;
