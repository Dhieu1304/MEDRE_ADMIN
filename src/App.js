// import "./App.css";
// import defineAbilityFor from "./config/defineAbility";
// import { AbilityContext, Can } from "./store/AbilityStore";
// import { Patient, Report, Booking } from "./entities";
// import { ToastContainer } from "react-toastify";

// const user = { roleId: 1 };
// const ability = defineAbilityFor(user);

// const patient = new Patient({ id: 1 });
// const report = new Report({ id: 1 });
// const booking = new Booking({ id: 1 });

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Fragment } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Backdrop, CircularProgress } from "@mui/material";

import { privateRoutes, publicRoutes } from "./routes";
import DefaultLayout from "./layouts/DefaultLayout";
import { useAuthStore } from "./store/AuthStore/hooks";

function App() {
  const authStore = useAuthStore();

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={authStore.isLoading}>
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
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
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
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
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
    </>
  );
  // return (
  //   <AbilityContext.Provider value={ability}>
  //     <div className="booking">
  //       roleId = {user?.roleId} - Chức năng Booking:
  //       <Can I="create" a={booking}>
  //         <li>Create</li>
  //       </Can>
  //       <Can I="read" a={booking}>
  //         <li>read</li>
  //       </Can>
  //       <Can I="write" a={booking}>
  //         <li>write</li>
  //       </Can>
  //       <Can I="update" a={booking}>
  //         <li>update</li>
  //       </Can>
  //     </div>
  //     <div className="patient">
  //       roleId = {user?.roleId} - Chức năng Patient:
  //       <Can I="create" a={patient}>
  //         <li>Create</li>
  //       </Can>
  //       <Can I="read" a={patient}>
  //         <li>read</li>
  //       </Can>
  //       <Can I="write" a={patient}>
  //         <li>write</li>
  //       </Can>
  //       <Can I="update" a={patient}>
  //         <li>update</li>
  //       </Can>
  //     </div>
  //     <div className="report">
  //       roleId = {user?.roleId} - Chức năng Report:
  //       <Can I="create" a={report}>
  //         <li>Create</li>
  //       </Can>
  //       <Can I="read" a={report}>
  //         <li>read</li>
  //       </Can>
  //       <Can I="write" a={report}>
  //         <li>write</li>
  //       </Can>
  //       <Can I="update" a={report}>
  //         <li>update</li>
  //       </Can>
  //     </div>
  //   </AbilityContext.Provider>
  // );
}

export default App;
