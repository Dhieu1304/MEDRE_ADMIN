import { Box, Typography } from "@mui/material";

function NotHaveAccess() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Typography component="h1" fontWeight="700">
        You dont have access
      </Typography>
    </Box>
  );
}

export default NotHaveAccess;
