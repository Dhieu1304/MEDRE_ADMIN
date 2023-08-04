import { Avatar, Box, TextField } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../components/CustomModal";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import CustomOverlay from "../../../components/CustomOverlay/CustomOverlay";
import staffServices from "../../../services/staffServices";

function ChangeAvatarModal({ show, setShow, data, setData, handleAfterChangeAvatar }) {
  const [image, setImage] = useState(data?.image);

  const [file, setFile] = useState(null);

  const { isLoading, fetchApi } = useFetchingStore();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      setFile(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleChangeAvatar = async () => {
    return fetchApi(async () => {
      const res = await staffServices.changeAvatar(file);
      if (res.success) {
        setData({});
        setShow(false);
        if (handleAfterChangeAvatar) {
          await handleAfterChangeAvatar();
        }
        return { ...res };
      }
      return { ...res };
    });
  };

  const { t } = useTranslation("userFeature", { keyPrefix: "ChangeAvatarModal" });

  return (
    <>
      <CustomOverlay open={isLoading} />
      <CustomModal
        show={show}
        setShow={setShow}
        data={data}
        setData={setData}
        title={t("title")}
        submitBtnLabel={t("button.save")}
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
              objectfit: "contain"
            }}
            variant="square"
            src={image}
          />

          <TextField type="file" onChange={handleImageChange} />
          {/* <input type="file" onChange={handleImageChange} multiple /> */}
        </Box>
      </CustomModal>
    </>
  );
}

ChangeAvatarModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  handleAfterChangeAvatar: PropTypes.func.isRequired
};

export default ChangeAvatarModal;
