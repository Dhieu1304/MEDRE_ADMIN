import { Avatar, Box, TextField } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../components/CustomModal";

function ChangeAvatarModal({ show, setShow, data, setData }) {
  const handleChangeAvatar = async () => {};

  const [image, setImage] = useState(data?.image);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const { t } = useTranslation("staffFeature", { keyPrefix: "change_avatar_modal" });

  return (
    <CustomModal
      show={show}
      setShow={setShow}
      data={data}
      setData={setData}
      title={t("title")}
      submitBtnLabel={t("btn_label")}
      onSubmit={handleChangeAvatar}
    >
      <Box
        sx={{
          width: 500,
          height: 500,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          justifySelf: "center"
        }}
      >
        <Avatar
          sx={{
            width: "80%",
            height: "80%"
          }}
          imgProps={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
          variant="square"
          src={image}
        />

        {/* <InputLabel>{t("upload")}</InputLabel> */}
        <TextField type="file" onChange={handleImageChange} />
      </Box>
    </CustomModal>
  );
}

ChangeAvatarModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired
};

export default ChangeAvatarModal;
