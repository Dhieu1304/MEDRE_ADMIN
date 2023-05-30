import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../components/CustomModal";

import { useFetchingStore } from "../../../store/FetchingApiStore";
import settingServices from "../../../services/settingServices";
import CustomInput from "../../../components/CustomInput/CustomInput";

function ChangeSettingModal({ show, setShow, data, setData, handleAfterEditSetting }) {
  const { handleSubmit, control, trigger } = useForm({
    mode: "onChange",
    defaultValues: {
      value: data?.value
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("settingFeature", { keyPrefix: "ChangeSettingModal" });
  const { t: tSetting } = useTranslation("settingEntity", { keyPrefix: "properties" });
  const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });

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

  return (
    <CustomModal
      show={show}
      setShow={setShow}
      data={data}
      setData={setData}
      title={t("title")}
      submitBtnLabel={t("button.save")}
      onSubmit={handleSubmit(handleEditSetting)}
    >
      <CustomInput
        control={control}
        rules={{
          required: tInputValidation("required")
        }}
        label={tSetting("descName")}
        trigger={trigger}
        name="value"
        type="number"
      />
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
