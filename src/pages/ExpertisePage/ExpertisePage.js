import { Route, Routes } from "react-router-dom";

import { ExpertiseList } from "../../features/expertise";
import { expertiseRoutes } from "./routes";

export default function ExpertisePage() {
  return (
    <Routes>
      <Route path={expertiseRoutes.list} element={<ExpertiseList />} />
    </Routes>
  );
}
