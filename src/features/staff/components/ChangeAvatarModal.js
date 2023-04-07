import { Avatar, Box, TextField } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../components/CustomModal";

function ChangeAvatarModal({ show, setShow, data, setData, disbled }) {
  const handleChangeAvatar = async () => {
    // if (!disbled) {
    // }
  };

  const [image, setImage] = useState(data?.image);

  const handleImageChange = (e) => {
    if (!disbled) {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImage(event.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    }
  };

  const { t } = useTranslation("staffFeature", { keyPrefix: "change_avatar_modal" });

  return (
    <CustomModal
      show={show}
      setShow={setShow}
      data={data}
      setData={setData}
      title={!disbled && t("title")}
      submitBtnLabel={!disbled && t("btn_label")}
      onSubmit={!disbled && handleChangeAvatar}
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

        {!disbled && <TextField type="file" onChange={handleImageChange} />}
      </Box>
    </CustomModal>
  );
}

ChangeAvatarModal.defaultProps = {
  disbled: undefined
};

ChangeAvatarModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  disbled: PropTypes.bool
};

export default ChangeAvatarModal;
