import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Paper, Box, Grid, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import images from "../../assets/images";

import routeConfig from "../../config/routeConfig";
import routes from "./routes";
import { Login } from "../../features/auth";

const theme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh", justifyContent: "center" }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              px: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 14
            }}
          >
            <Box
              component="div"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                my: 2,
                cursor: "pointer"
              }}
              onClick={() => {
                navigate(routeConfig.home);
              }}
            >
              <Box
                component="img"
                sx={{
                  mr: 1
                }}
                src={images.logo}
                width={40}
              />
              <Typography component="h1" variant="h3">
                Medre Admin
              </Typography>
            </Box>

            <Routes>
              <Route path={routes.login} element={<Login />} />
              <Route path={routes.default} element={<Navigate to={routeConfig.auth + routes.login} />} />
            </Routes>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
