import * as React from "react";

import { Route, Routes } from "react-router-dom";

import routes from "./routes";
import { ReExaminationList } from "../../features/reExamination";

export default function ReExaminationListPage() {
  return (
    <Routes>
      <Route path={routes.list} element={<ReExaminationList />} />
    </Routes>
  );
}
