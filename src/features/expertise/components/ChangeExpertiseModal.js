import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import CustomModal from "../../../components/CustomModal";

import { useFetchingStore } from "../../../store/FetchingApiStore";
// import expertiseServices from "../../../services/expertiseServices";
import CustomInput from "../../../components/CustomInput/CustomInput";
import expertiseServices from "../../../services/expertiseServices";

function ChangeExpertiseModal({ show, setShow, data, setData, handleAfterEditExpertise }) {
  const { handleSubmit, control, trigger } = useForm({
    mode: "onChange",
    defaultValues: {
      name: data?.name,
      offlinePrice: data?.priceOffline,
      onlinePrice: data?.priceOnline
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("expertiseFeature", { keyPrefix: "ChangeExpertiseModal" });
  const { t: tExpertise } = useTranslation("expertiseEntity", { keyPrefix: "properties" });
  const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });

  const { fetchApi } = useFetchingStore();

  const handleEditExpertise = async ({ name, offlinePrice, onlinePrice }) => {
    await fetchApi(async () => {
      const id = data?.id;
      const res = await expertiseServices.editExpertise({ id, name, offlinePrice, onlinePrice });
      if (res?.success) {
        setShow(false);
        setData({});
        if (handleAfterEditExpertise) await handleAfterEditExpertise();
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
      onSubmit={handleSubmit(handleEditExpertise)}
    >
      <Grid container>
        <Grid item xl={12} md={12} xs={12} mb={2} px={1}>
          <CustomInput
            control={control}
            rules={{
              required: tInputValidation("required")
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
              required: tInputValidation("required"),
              min: {
                value: 0,
                message: tInputValidation("gt", {
                  left: tExpertise("offlinePriceLabel"),
                  right: 0
                })
              }
            }}
            label={tExpertise("offlinePriceLabel")}
            isCustomError
            trigger={trigger}
            name="offlinePrice"
            type="number"
          />
        </Grid>
        <Grid item xl={12} md={6} xs={12} mb={2} px={1}>
          <CustomInput
            control={control}
            rules={{
              required: tInputValidation("required"),
              min: {
                value: 0,
                message: tInputValidation("gt", {
                  left: tExpertise("onlinePriceLabel"),
                  right: 0
                })
              }
            }}
            isCustomError
            label={tExpertise("onlinePriceLabel")}
            trigger={trigger}
            name="onlinePrice"
            type="number"
          />
        </Grid>
      </Grid>
    </CustomModal>
  );
}

ChangeExpertiseModal.defaultProps = {
  handleAfterEditExpertise: undefined
};

ChangeExpertiseModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  handleAfterEditExpertise: PropTypes.func
};

export default ChangeExpertiseModal;
