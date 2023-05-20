import PropTypes from "prop-types";
import { Avatar, Box, Card, CardHeader } from "@mui/material";

function PersonHeadInfo({ person }) {
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
        />
      </Card>
    </Box>
  );
}

PersonHeadInfo.propTypes = {
  person: PropTypes.object.isRequired
};

export default PersonHeadInfo;
