import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Fragment, useEffect, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Backdrop, CircularProgress, ThemeProvider } from "@mui/material";

import { createTheme } from "@mui/material/styles";
import * as locales from "@mui/material/locale";
import { privateRoutes, publicRoutes } from "./routes";
import DefaultLayout from "./layouts/DefaultLayout";
import { useAuthStore } from "./store/AuthStore/hooks";
import { AbilityContext } from "./store/AbilityStore";
import defineAbilityFor from "./config/defineAbility";
import { getTheme } from "./config/themeConfig";
import { useAppConfigStore } from "./store/AppConfigStore/hooks";

function App() {
  const authStore = useAuthStore();
  const { mode, locale } = useAppConfigStore();

  const ability = defineAbilityFor(authStore.user);

  const theme = useMemo(() => createTheme(getTheme(mode), locales[locale]), [mode, locale]);

  useEffect(() => {
    const loadData = async () => {
      await authStore.loadUserInfo();
    };
    loadData();
  }, []);

  return (
    <AbilityContext.Provider value={ability}>
      <ThemeProvider theme={theme}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (currentTheme) => currentTheme.zIndex.drawer + 1 }}
          open={authStore.isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {authStore?.isLogin ? (
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
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <Layout>
                        <Page to={to} />
                      </Layout>
                    }
                  />
                );
              })}
            </Routes>
          </Router>
        ) : (
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
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <Layout>
                        <Page to={to} />
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
    </AbilityContext.Provider>
  );
}

export default App;
