import { Route, Routes } from "react-router-dom";

import { PatientDetail, PatientList } from "../../features/patient";
import { patientRoutes } from "./routes";

export default function PatientPage() {
  return (
    <Routes>
      <Route path={patientRoutes.list} element={<PatientList />} />
      <Route path={patientRoutes.detail} element={<PatientDetail />} />
    </Routes>
  );
}
