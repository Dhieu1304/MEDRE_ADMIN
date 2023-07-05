import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
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
  }, [notificationId]);

  return (
    <>
      <CustomOverlay open={isLoading} />
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",

          px: { xs: 4, md: 10, lg: 20 },
          position: "relative"
        }}
      >
        <Card
          sx={{
            border: "1px solid rgba(0,0,0,0.2)",
            borderWidth: 0.1,
            backgroundColor: "rgb(255, 255, 255)"
          }}
        >
          <CardHeader
            title={
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {notification?.notificationsParent?.title}
              </Typography>
            }
            subheader={notification?.notificationsParent?.content}
          />
          <CardContent>
            <ReactQuill value={decode(notification?.notificationsParent?.description)} readOnly theme="bubble" />
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default NotificationDetail;
