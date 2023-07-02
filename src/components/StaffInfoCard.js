import { Avatar, Card, CardHeader, Typography } from "@mui/material";
import PropTypes from "prop-types";

function StaffInfoCard({ staff }) {
  return (
    <Card
      sx={{
        height: "100%",
        maxWidth: 500,
        display: "flex",
        flexDirection: "column",
        p: 0,
        cursor: "pointer",
        border: "none",
        boxShadow: "none"
      }}
    >
      <CardHeader
        avatar={<Avatar alt={staff?.name} src={staff?.image} />}
        title={<Typography variant="h6">{staff?.name}</Typography>}
        subheader={staff?.certificate && `(${staff?.certificate})`}
      />
    </Card>
  );
}

StaffInfoCard.propTypes = {
  staff: PropTypes.object.isRequired
};

export default StaffInfoCard;
