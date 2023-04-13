import { Route, Routes } from "react-router-dom";
import { DoctorSchedule } from "../../features/schedule";
import { StaffDetail, StaffList } from "../../features/staff";
import routes from "./routes";

export default function StaffPage() {
  return (
    <Routes>
      <Route path={routes.list} element={<StaffList />} />
      <Route
        path={`${routes.detail}/*`}
        element={
          <Routes>
            <Route path="/" element={<StaffDetail />} />
            <Route path={routes.schedule} element={<DoctorSchedule />} />
          </Routes>
        }
      />
      {/* <Route path={routes.default} element={<Navigate to={routes.list} />} /> */}
    </Routes>
  );
}

// import { Navigate, Route, Routes } from "react-router-dom";
// import { DoctorSchedule } from "../../features/schedule";
// import { StaffDetail, StaffList } from "../../features/staff";
// import { FetchingApiProvider } from "../../store/FetchingApiStore";
// import routes from "./routes";

// export default function StaffPage() {
//   return (
//     <Routes>
//       <Route
//         path={routes.list}
//         element={
//           <FetchingApiProvider>
//             <StaffList />
//           </FetchingApiProvider>
//         }
//       />
//       <Route
//         path={routes.detail}
//         // element={
//         //   <>
//         //     <FetchingApiProvider>
//         //       <StaffDetail />
//         //     </FetchingApiProvider>
//         //     <Routes>
//         //       <Route
//         //         path={routes.schedule}
//         //         element={
//         //           <FetchingApiProvider>
//         //             <DoctorSchedule />
//         //           </FetchingApiProvider>
//         //         }
//         //       />
//         //     </Routes>
//         //   </>
//         // }
//       >
//         <Route
//           path={""}
//           element={
//             <FetchingApiProvider>
//               <StaffDetail />
//             </FetchingApiProvider>
//           }
//         ></Route>

//         <Route
//           path={routes.schedule}
//           element={
//             <FetchingApiProvider>
//               <DoctorSchedule />
//             </FetchingApiProvider>
//           }
//         ></Route>
//       </Route>
//       {/* <Route path={routes.default} element={<Navigate to={routes.list} />} /> */}
//     </Routes>
//   );
// }
