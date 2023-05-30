import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

function NotificationDetail() {
  const location = useLocation();
  const notification = location.state?.notification;

  // console.log("notification: ", notification);
  return (
    <Box
      sx={{
        width: "100%",
        px: {
          xs: 4,
          md: 10,
          lg: 20
        },
        position: "relative"
      }}
    >
      <Typography
        variant="h2"
        textAlign="center"
        sx={{
          fontSize: {
            xs: 16,
            md: 25,
            lg: 40
          },
          fontWeight: 600
        }}
      >
        {notification?.notificationsParent?.title}
      </Typography>
      <Box component="p">{notification?.notificationsParent?.content}</Box>
      <Box component="p">{notification?.notificationsParent?.description}</Box>
    </Box>
  );
}

export default NotificationDetail;
