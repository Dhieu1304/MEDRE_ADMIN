import PropTypes from "prop-types";
import { Avatar, Box, Card, CardHeader } from "@mui/material";
import { useAuthStore } from "../../store/AuthStore";

function PersonHeadInfo({ person, changeAvatarModal }) {
  const authStore = useAuthStore();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Card
        sx={{
          boxShadow: "none"
        }}
      >
        <CardHeader
          avatar={<Avatar sx={{ width: 150, height: 150, cursor: "pointer" }} alt={person?.name} src={person?.image} />}
          title={person?.name}
          subheader={person?.id}
          onClick={() => {
            if (authStore.staff?.id === person?.id) {
              changeAvatarModal?.setShow(true);
              changeAvatarModal?.setData(person);
            }
          }}
        />
      </Card>
    </Box>
  );
}

PersonHeadInfo.defaultProps = {
  changeAvatarModal: undefined
};

PersonHeadInfo.propTypes = {
  person: PropTypes.object.isRequired,
  changeAvatarModal: PropTypes.object
};

export default PersonHeadInfo;
