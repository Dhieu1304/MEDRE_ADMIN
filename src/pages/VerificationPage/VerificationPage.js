import * as React from "react";

import { Route, Routes } from "react-router-dom";

import routes from "./routes";
import { Verification } from "../../features/verification";

export default function VerificationPage() {
  return (
    <Routes>
      <Route path={routes.verification} element={<Verification />} />
    </Routes>
  );
}
