import PropTypes from "prop-types";
import React, { useState } from "react";
import { IconButton, Badge, Menu, MenuItem, Box, Typography, Button } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAppConfigStore } from "../store/AppConfigStore";
import { useFetchingStore } from "../store/FetchingApiStore";
import notificationServices from "../services/notificationServices";

function CustomNotification({ notifications, unreadNotificationCount }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const { t } = useTranslation("components", { keyPrefix: "CustomNotification" });
  const { fetchApi } = useFetchingStore();
  const { notificationLimit, notificationPage, notificationTotalPages, updateNotifications, markReadNotification } =
    useAppConfigStore();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoadMoreNotifications = async () => {
    await fetchApi(async () => {
      const newPage = notificationPage + 1;
      // console.log("notificationLimit: ", notificationLimit);
      const res = await notificationServices.getNotificationList({ page: newPage, limit: notificationLimit });
      if (res.success) {
        const notificationData = res?.notifications || [];
        const page = res?.page;
        const limit = res?.limit;
        const totalPages = res?.totalPages;
        const count = res?.count;

        updateNotifications({
          notificationData: [...notifications, ...notificationData],
          page,
          limit,
          totalPages,
          count
        });
        return { ...res };
      }
      return { ...res };
    });
  };

  const handleToNotificationDetail = async (id, index) => {
    await fetchApi(
      async () => {
        // console.log("notificationLimit: ", notificationLimit);
        const res = await notificationServices.markRead(id);
        if (res.success) {
          markReadNotification(index);
          return { ...res };
        }
        return { ...res };
      },
      { hideErrorToast: true, hideSuccessToast: true }
    );
  };

  return (
    <Box>
      <IconButton color="inherit" onClick={handleClick} size="large" sx={{ mr: 2 }}>
        {unreadNotificationCount > 0 ? (
          <Badge badgeContent={unreadNotificationCount} color="secondary">
            <NotificationsIcon />
          </Badge>
        ) : (
          <NotificationsIcon />
        )}
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <Typography variant="h4" textAlign="center" fontSize={20} fontWeight={600} sx={{ py: 1 }}>
          {t("title")}
        </Typography>
        <Box
          sx={{
            maxHeight: 400,
            overflowY: "scroll",
            overflowX: "hidden",
            // border: "1px solid rgba(0,0,0)",
            m: 0,
            width: 350
          }}
        >
          {notifications.map((notification, index) => (
            <MenuItem
              key={notification?.id}
              onClick={handleClose}
              sx={{
                position: "relative"
              }}
            >
              <Box
                component={Link}
                to={`/notification/${notification?.id}`}
                sx={{
                  textDecoration: "none"
                }}
                state={{
                  notification
                }}
                onClick={async () => handleToNotificationDetail(notification?.id, index)}
              >
                <Typography variant="h5" fontSize={16} fontWeight={600} color="black">
                  {notification?.notificationsParent?.title?.slice(0, 50)}
                  {notification?.notificationsParent?.title?.length > 50 && "..."}
                </Typography>
                <Box component="p" fontSize={12} color="rgba(0,0,0,0.6)">
                  {notification?.notificationsParent?.content?.slice(0, 50)}
                  {notification?.notificationsParent?.content?.length > 50 && "..."}
                </Box>
                {!notification?.read && ( // Kiểm tra read là false
                  <Badge
                    color="success"
                    variant="dot"
                    overlap="circular"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: 10
                    }}
                  />
                )}
              </Box>
            </MenuItem>
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Button variant="text" onClick={handleLoadMoreNotifications} disabled={notificationTotalPages <= notificationPage}>
            {t("button.seeMore")}
          </Button>
        </Box>
      </Menu>
    </Box>
  );
}

CustomNotification.propTypes = {
  notifications: PropTypes.array.isRequired,
  unreadNotificationCount: PropTypes.number.isRequired
};

export default CustomNotification;
