import * as React from "react";
import PropTypes from "prop-types";
import { Box, IconButton, Toolbar, Typography, Avatar, Menu, MenuItem, Tooltip } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import { headerDropdownMenu } from "./config";

import images from "../../../assets/images";
import { useAuthStore } from "../../../store/AuthStore/hooks";
import CustomAppBar from "../../../components/CustomAppBar";

function Header({ open, handleDrawerOpen }) {
  const authStore = useAuthStore();

  const [anchorElUser, setAnchorElUser] = React.useState(null);

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
              component="a"
              href="/"
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
              <Avatar alt={authStore.user?.name} src={authStore.user?.avatar || " "} />
              {/* src={authStore.user?.avatar} */}
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
                <Typography textAlign="center">{item.label}</Typography>
              </MenuItem>
            ))}
            <MenuItem onClick={onLogout}>
              <Typography textAlign="center">Logout</Typography>
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