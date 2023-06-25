import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { decode } from "html-entities";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useParams } from "react-router-dom";
import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import notificationServices from "../../services/notificationServices";
import { useFetchingStore } from "../../store/FetchingApiStore";

function NotificationDetail() {
  const [notification, setNotification] = useState();

  const params = useParams();
  const notificationId = params?.notificationId;

  const { isLoading, fetchApi } = useFetchingStore();
  useEffect(() => {
    const loadData = async () => {
      await fetchApi(
        async () => {
          const res = await notificationServices.getNotificationDetail(notificationId);

          if (res.success) {
            const notificationData = res.notification;
            setNotification(notificationData);

            return { ...res };
          }
          setNotification({});
          return { ...res };
        },
        { hideSuccessToast: true }
      );
    };
    loadData();
  }, []);

  return (
    <>
      <CustomOverlay open={isLoading} />
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

        <ReactQuill value={decode(notification?.notificationsParent?.description)} readOnly theme="bubble" />
      </Box>
    </>
  );
}

export default NotificationDetail;
