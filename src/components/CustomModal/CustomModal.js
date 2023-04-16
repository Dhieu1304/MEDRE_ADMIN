import { Close } from "@mui/icons-material";
import { Modal, Typography, Box, Button, Grid, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function CustomModal({ show, setShow, setData, children, title, submitBtnLabel, onSubmit }) {
  const { t } = useTranslation("components", { keyPrefix: "custom_modal" });

  const handleClose = () => {
    if (setData) setData(null);
    setShow(false);
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit();
  };
  return (
    <Modal open={show} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          border: "1px solid rgba(0,0,0,0.2)",
          borderRadius: 1,
          boxShadow: 24,
          p: 2
        }}
      >
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Typography component="h1" fontSize={20} fontWeight="700" p={0}>
            {title}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <Box
          py={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {children}
        </Box>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item columns={2}>
            <Button variant="outlined" onClick={handleClose}>
              {t("cancel")}
            </Button>
          </Grid>
          <Grid item columns={2}>
            {submitBtnLabel && (
              <Button variant="contained" onClick={handleSubmit}>
                {submitBtnLabel}
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

CustomModal.defaultProps = {
  setData: undefined,
  children: undefined,
  title: undefined,
  submitBtnLabel: undefined,
  onSubmit: undefined
};

CustomModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  setData: PropTypes.func,
  children: PropTypes.node,
  title: PropTypes.string,
  submitBtnLabel: PropTypes.string,
  onSubmit: PropTypes.func
};

export default CustomModal;
