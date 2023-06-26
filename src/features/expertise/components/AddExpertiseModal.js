import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import CustomInput from "../../../components/CustomInput";
import { useFetchingStore } from "../../../store/FetchingApiStore";
// import staffServices from "../../../services/staffServices";
import { expertiseInputValidate } from "../../../entities/Expertise";
import expertiseServices from "../../../services/expertiseServices";

function AddExpertiseModal({ show, setShow, handleAfterAddExpertise }) {
  const { control, trigger, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      offlinePrice: "",
      onlinePrice: ""
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("expertiseFeature", { keyPrefix: "AddExpertiseModal" });
  const { t: tExpertise } = useTranslation("expertiseEntity", { keyPrefix: "properties" });

  const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });

  const { fetchApi } = useFetchingStore();

  const handleAddExpertise = async ({ name, offlinePrice, onlinePrice }) => {
    // console.log({ name, offlinePrice, onlinePrice });
    await fetchApi(async () => {
      const res = await expertiseServices.createExpertise({ name, offlinePrice, onlinePrice });

      if (res?.success) {
        setShow(false);
        if (handleAfterAddExpertise) await handleAfterAddExpertise();
        return { ...res };
      }
      return { ...res };
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
      <Grid container>
        <Grid item xl={12} md={12} xs={12} mb={2} px={1}>
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
            label={tExpertise("name")}
            trigger={trigger}
            name="name"
          />
        </Grid>
        <Grid item xl={12} md={6} xs={12} mb={2} px={1}>
          <CustomInput
            control={control}
            rules={{
              required: tInputValidation("required")
            }}
            label={tExpertise("offlinePrice")}
            trigger={trigger}
            name="offlinePrice"
            type="number"
          />
        </Grid>
        <Grid item xl={12} md={6} xs={12} mb={2} px={1}>
          <CustomInput
            control={control}
            rules={{
              required: tInputValidation("required")
            }}
            label={tExpertise("onlinePrice")}
            trigger={trigger}
            name="onlinePrice"
            type="number"
          />
        </Grid>
      </Grid>
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
