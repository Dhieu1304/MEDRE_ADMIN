import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useMediaQuery
} from "@mui/material";
import PropTypes from "prop-types";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import images from "../../../assets/images";
import CustomDrawer, { CustomDrawerHeader } from "../../../components/CustomDrawer";
import { sideBarItems } from "./config";

function SideBar({ open, handleDrawerClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <CustomDrawer variant="permanent" open={open} isMobile={isMobile}>
      <CustomDrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          <Box sx={{ display: { xs: "flex", md: "flex", alignItems: "center" } }}>
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
          {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </CustomDrawerHeader>
      <Divider />
      <List>
        {sideBarItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5
              }}
              component={Link}
              to={item.to}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center"
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </CustomDrawer>
  );
}

SideBar.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDrawerClose: PropTypes.func.isRequired
};

export default SideBar;
