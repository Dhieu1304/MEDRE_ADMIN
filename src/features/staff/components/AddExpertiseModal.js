import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CustomModal from "../../../components/CustomModal";
import CustomInput from "../../../components/CustomInput";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import staffServices from "../../../services/staffServices";
import { expertiseInputValidate } from "../../../entities/Expertise";

function AddExpertiseModal({ show, setShow, handleAfterAddExpertise }) {
  const { control, trigger, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      expertise: ""
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("staffFeature", { keyPrefix: "AddExpertiseModal" });
  const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });

  const { fetchApi } = useFetchingStore();

  const handleAddExpertise = async ({ expertise }) => {
    await fetchApi(async () => {
      const res = await staffServices.createExpertise(expertise);

      if (res.success) {
        setShow(false);
        if (handleAfterAddExpertise) await handleAfterAddExpertise();
        return { success: true };
      }
      toast(res.message);
      return { error: res.message };
    });
  };

  return (
    <CustomModal
      show={show}
      setShow={setShow}
      title={t("title")}
      submitBtnLabel={t("button.add")}
      onSubmit={handleSubmit(handleAddExpertise)}
    >
      <CustomInput
        control={control}
        rules={{
          required: tInputValidation("required"),
          maxLength: {
            value: expertiseInputValidate.NAME_MAX_LENGTH,
            message: tInputValidation("maxLength", {
              maxLength: expertiseInputValidate.NAME_MAX_LENGTH
            })
          }
        }}
        label={t("expertise")}
        trigger={trigger}
        name="expertise"
        type="text"
      />
    </CustomModal>
  );
}

AddExpertiseModal.defaultProps = {
  handleAfterAddExpertise: undefined
};

AddExpertiseModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  handleAfterAddExpertise: PropTypes.func
};

export default AddExpertiseModal;
