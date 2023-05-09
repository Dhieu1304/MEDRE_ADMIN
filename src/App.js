import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Fragment, useEffect, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, ThemeProvider } from "@mui/material";
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

function App() {
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
    };
    loadData();
  }, []);

  const ability = defineAbilityFor(authStore.staff);

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
