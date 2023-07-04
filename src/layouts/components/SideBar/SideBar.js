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
import { Link, useMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import images from "../../../assets/images";
import CustomDrawer, { CustomDrawerHeader } from "../../../components/CustomDrawer";
import { sideBarItems } from "./config";
import routeConfig from "../../../config/routeConfig";
import { useAuthStore } from "../../../store/AuthStore";
import { staffRoles } from "../../../entities/Staff";
import { sidebarActionAbility } from "../../../entities/Sidebar/constant";

function SideBar({ open, handleDrawerClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:768px)");

  const { t } = useTranslation("layout", { keyPrefix: "sidebar" });
  const authStore = useAuthStore();

  const sideBarItemsByRole = useMemo(() => {
    const { ROLE_ADMIN, ROLE_DOCTOR, ROLE_NURSE, ROLE_CUSTOMER_SERVICE } = staffRoles;
    const {
      STAFF,
      USER,
      PATIENT,
      BOOKING,
      SCHEDULE,
      SETTING,
      EXPERTISE,
      NOTIFICATION,
      RE_EXAMINATION,
      STATISTICS,
      DOCTOR_CALENDAR,
      SUPPORT
    } = sidebarActionAbility;
    let keys = [];
    switch (authStore.staff?.role) {
      case ROLE_ADMIN:
        keys = [...keys, STATISTICS, STAFF, USER, PATIENT, BOOKING, SCHEDULE, SETTING, EXPERTISE, NOTIFICATION];
        break;
      case ROLE_DOCTOR:
        keys = [...keys, BOOKING, DOCTOR_CALENDAR, PATIENT];
        break;
      case ROLE_NURSE:
        keys = [...keys, SCHEDULE, RE_EXAMINATION, SUPPORT, STAFF, USER, PATIENT, BOOKING];
        break;
      case ROLE_CUSTOMER_SERVICE:
        keys = [...keys, SCHEDULE, RE_EXAMINATION, SUPPORT, STAFF, USER, PATIENT, BOOKING];
        break;
      default:
        break;
    }

    const filteredSidebar = sideBarItems
      .filter((item) => keys.includes(item.id))
      .sort((a, b) => {
        const indexA = keys.indexOf(a.id);
        const indexB = keys.indexOf(b.id);
        return indexA - indexB;
      });
    return filteredSidebar;
  }, [authStore.staff]);

  return (
    <CustomDrawer variant="permanent" open={open} isMobile={isMobile}>
      <CustomDrawerHeader>
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
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </CustomDrawerHeader>
      <Divider />
      <List
        sx={{
          bgcolor: "inherit"
        }}
      >
        {sideBarItemsByRole?.map((item) => {
          // const isMatch = useMatch(item.to());
          // const isMatch = useMatch(`/g/:${item.to()}/*`);
          const isMatch = useMatch({
            path: item.to(authStore.staff?.id),
            end: false
          });

          const activeSx = isMatch
            ? {
                backgroundColor: theme.palette.primary.light,
                color: "white"
              }
            : {};
          return (
            <ListItem key={item.label} disablePadding sx={{ display: "block", ...activeSx }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5
                }}
                component={Link}
                to={item.to(authStore.staff?.id)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center"
                  }}
                >
                  <Box
                    sx={{
                      ...activeSx
                    }}
                  >
                    {item.icon}
                  </Box>
                </ListItemIcon>

                <ListItemText primary={t(item.label)} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </CustomDrawer>
  );
}

SideBar.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDrawerClose: PropTypes.func.isRequired
};

export default SideBar;
