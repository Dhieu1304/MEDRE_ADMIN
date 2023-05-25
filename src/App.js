import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Fragment, useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, ThemeProvider, Box, Typography } from "@mui/material";
import * as locales from "@mui/material/locale";

import { privateRoutes, publicRoutes } from "./routes";
import DefaultLayout from "./layouts/DefaultLayout";
import { useAuthStore } from "./store/AuthStore/hooks";
import { useAppConfigStore } from "./store/AppConfigStore";
import { getTheme } from "./config/themeConfig";
import defineAbilityFor from "./config/defineAbility";
import { AbilityContext } from "./store/AbilityStore";
import { useFetchingStore } from "./store/FetchingApiStore";
import staffServices from "./services/staffServices";
import images from "./assets/images";
import CustomOverlay from "./components/CustomOverlay/CustomOverlay";
// import "./config/firebase";
import { requestPermission } from "./config/firebase";
import { socket } from "./config/socketConfig";
import localStorageUtil from "./utils/localStorageUtil";

function App() {
  /*
    - Khi mới vào App, isFirstVisit = true, giao diện se hiện CustomOverlay để đợi cho useEffect thực hiện
    load staff info
    - Sau khi load staff info, dựa vào kết quả authStore.login để xác định route
    - Nếu ko có isFirstVisit thì lần đầu vào app isLogin = false nên luôn mặc định chuyển nếu Login Page
  */
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  const authStore = useAuthStore();
  const { mode, locale } = useAppConfigStore();
  const theme = useMemo(() => createTheme(getTheme(mode), locales[locale]), [mode, locale]);
  const { fetchApi } = useFetchingStore();

  useEffect(() => {
    const loadData = async () => {
      await fetchApi(async () => {
        const res = await staffServices.getStaffInfo();

        if (res.success) {
          const staff = res?.staff;
          authStore.autoLogin(staff);
          return { success: true };
        }
        return { error: res.message };
      });
      setIsFirstVisit(false);
    };
    loadData();
  }, []);

  // const [isConnected, setIsConnected] = useState(socket.connected);
  // const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    // console.log("Socket useEffect");
    function onConnect() {
      // console.log("Connect");
      // setIsConnected(true);
    }
    function onDisconnect() {
      // console.log("Diconnect");
      // setIsConnected(false);
    }
    function onFooEvent() {
      // console.log("onFooEvent");
      // setFooEvents((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);

    socket.on("connect_error", () => {
      // console.log("Eror", error.message);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
    };
  }, []);

  useEffect(() => {
    // console.log("authStore.isLogin: ", authStore.isLogin);
    if (authStore.isLogin) {
      socket.emit("accessToken", localStorageUtil.getItem(localStorageUtil.LOCAL_STORAGE.ACCESS_TOKEN));
      requestPermission();
    }
  }, [authStore.isLogin]);

  const ability = defineAbilityFor(authStore.staff);

  if (isFirstVisit) {
    return (
      <ThemeProvider theme={theme}>
        <CustomOverlay open />
        <Box
          component="div"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "100vw",
            height: "100vh",
            cursor: "pointer",
            pt: 10
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
      </ThemeProvider>
    );
  }
  return (
    <ThemeProvider theme={theme}>
      {authStore.isLogin ? (
        <AbilityContext.Provider value={ability}>
          <Router>
            <Routes>
              {privateRoutes.map((route) => {
                let Layout = DefaultLayout;
                if (route.layout) {
                  Layout = route.layout;
                } else if (route.layout === null) {
                  Layout = Fragment;
                }

                const Page = route.component;
                const to = route.props?.to;
                const replace = route.props?.replace;

                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <Layout>
                        <Page to={to} replace={replace} />
                      </Layout>
                    }
                  />
                );
              })}
            </Routes>
          </Router>
        </AbilityContext.Provider>
      ) : (
        <Router>
          <Routes>
            {publicRoutes.map((route) => {
              let Layout = DefaultLayout;
              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }

              const Page = route.component;
              const to = route.props?.to;
              const replace = route.props?.replace;

              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Layout>
                      <Page to={to} replace={replace} />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Router>
      )}

      <ToastContainer
        position="top-right"
        autoClose={50}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ThemeProvider>
  );
}

export default App;
