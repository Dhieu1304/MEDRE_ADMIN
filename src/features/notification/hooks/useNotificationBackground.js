import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import CustomNotificatioToast from "../../../components/CustomNotificatioToast";
import { SOCKET, socket } from "../../../config/socketConfig";
import { useAuthStore } from "../../../store/AuthStore/hooks";
import cookiesUtil from "../../../utils/cookiesUtil";
import notificationServices from "../../../services/notificationServices";
import { requestPermission } from "../../../config/firebase";

const useNotificationBackground = () => {
  const [isSocketConnected, setIsSocketConnected] = useState(true);
  const { notifications, notificationLimit, updateNotifications, setUnreadNotificationCount } = useAppConfigStore();

  const authStore = useAuthStore();
  const { fetchApi } = useFetchingStore();

  const loadNotifications = async (loadLimit) => {
    const newLoadLimit = loadLimit || notificationLimit || 5;
    // console.log("newLoadLimit: ", newLoadLimit);

    await fetchApi(async () => {
      const res = await notificationServices.getNotificationList({ limit: newLoadLimit });
      if (res.success) {
        const notificationData = res?.notifications || [];
        const page = res?.page;
        const limit = res?.limit;
        const totalPages = res?.totalPages;
        const count = res?.count;
        // console.log({ page, limit, totalPages, count });
        updateNotifications({
          notificationData,
          page,
          limit,
          totalPages,
          count
        });
        return { ...res };
      }
      return { ...res };
    });

    await fetchApi(async () => {
      const res = await notificationServices.countUnread({ limit: newLoadLimit });
      if (res.success) {
        const unreadCountData = res?.unreadCount || 0;
        setUnreadNotificationCount(unreadCountData);
        return { ...res };
      }
      return { ...res };
    });
  };

  const onConnect = () => {
    // console.log("Connect");
    setIsSocketConnected(true);
  };
  const onDisconnect = () => {
    // console.log("Diconnect");
    setIsSocketConnected(false);
  };

  const handleNotifications = async (payload) => {
    toast(<CustomNotificatioToast title={payload?.notification?.title} body={payload?.notification?.body} />, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });

    await loadNotifications((notifications?.length || 0) + 1);
  };

  // console.log("notifications: ", notifications);

  useEffect(() => {
    socket.on(SOCKET.CONNECT, () => {});
    socket.on(SOCKET.DISCONNECT, () => {});
    socket.on(SOCKET.CONNECT_ERROR, () => {});
    socket.on(SOCKET.SUCCESS, () => {});
    socket.on(SOCKET.ERROR, () => {});

    // socket.on("Success", (message) => {
    //   // console.log("Success: ", message);
    // });
    // socket.on("Error", (message) => {
    //   // console.log("Error: ", message);
    // });
    // socket.on("connect_error", (error) => {
    //   // console.log("Error", error.message);
    // });

    return () => {
      socket.off(SOCKET.CONNECT, onConnect);
      socket.off(SOCKET.DISCONNECT, onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (isSocketConnected) {
      socket.on(SOCKET.NOTIFICATION, handleNotifications);
      return () => {
        socket.off(SOCKET.NOTIFICATION, handleNotifications);
      };
    }
    return () => {};
  }, [isSocketConnected, notifications]);

  const handleAfterLogin = async () => {
    socket.emit(SOCKET.JOIN_ROOM, Cookies.get(cookiesUtil.COOKIES.ACCESS_TOKEN));
    await loadNotifications();
    const token = await requestPermission();
    if (token) {
      await notificationServices.subscribeTopic(token);
    }
  };

  useEffect(() => {
    // console.log("authStore.isLogin: ", authStore.isLogin);
    if (authStore.isLogin) {
      handleAfterLogin();
    }
  }, [authStore.isLogin]);

  // console.log("notifications: ", notifications);
};

export default useNotificationBackground;
