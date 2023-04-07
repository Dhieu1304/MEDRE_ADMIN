import PropTypes from "prop-types";
import {
  Box,
  IconButton,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Switch
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { headerDropdownMenu } from "./config";

import images from "../../../assets/images";
import { useAuthStore } from "../../../store/AuthStore/hooks";
import CustomAppBar from "../../../components/CustomAppBar";
import routeConfig from "../../../config/routeConfig";
import { useAppConfigStore } from "../../../store/AppConfigStore/hooks";
import { DARK, LIGHT } from "../../../config/themeConfig";

function Header({ open, handleDrawerOpen }) {
  const authStore = useAuthStore();

  // const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState(null);

  const { mode, setMode, locale, setLocale } = useAppConfigStore();

  const { t, i18n } = useTranslation("layout", { keyPrefix: "header" });

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onLogout = async () => {
    await authStore.logout();
  };

  return (
    <CustomAppBar position="fixed" open={open}>
      <Toolbar>
        {!open && (
          <Box sx={{ display: { xs: "flex", md: "flex", alignItems: "center" } }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              component="img"
              sx={{
                mr: 1
              }}
              src={images.logo}
              width={30}
            />

            <Typography
              variant="h6"
              noWrap
              component={Link}
              to={routeConfig.home}
              sx={{
                mr: 2,
                display: { md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none"
              }}
            >
              MEDRE
            </Typography>
          </Box>
        )}

        <Box sx={{ display: { xs: "flex", md: "flex", marginLeft: "auto" } }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={authStore.staff?.name} src={authStore.staff?.image || " "} />
              {/* src={authStore.staff?.avatar} */}
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {headerDropdownMenu.map((item) => (
              <MenuItem key={item.label} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{t(item.label)}</Typography>
              </MenuItem>
            ))}
            <Box
              component={Link}
              to={`${routeConfig.staff}/${authStore.staff?.id}`}
              sx={{
                textDecoration: "none",
                color: "inherit"
              }}
            >
              <MenuItem>
                <Typography textAlign="center">{t("profile_label")}</Typography>
              </MenuItem>
            </Box>

            <MenuItem>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={mode === DARK}
                      onClick={() => {
                        setMode((prev) => {
                          return prev === LIGHT ? DARK : LIGHT;
                        });
                      }}
                    />
                  }
                  sx={{ ml: 0 }}
                  label="Dark mode"
                  labelPlacement="start"
                />
              </FormGroup>
            </MenuItem>
            <MenuItem>
              <FormGroup sx={{ justifyContent: "flex-start" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={locale === "enUS"}
                      onClick={() => {
                        const newLocale = locale === "viVN" ? "enUS" : "viVN";
                        const code = newLocale.slice(0, 2);
                        setLocale(newLocale);
                        i18n.changeLanguage(code);
                      }}
                    />
                  }
                  sx={{ ml: 0 }}
                  label="English"
                  labelPlacement="start"
                />
              </FormGroup>
            </MenuItem>
            <MenuItem onClick={onLogout}>
              <Typography textAlign="center">{t("logout_label")}</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </CustomAppBar>
  );
}

Header.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired
};

export default Header;
