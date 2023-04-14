import { Route, Routes } from "react-router-dom";

import { UserDetail, UserList } from "../../features/user";
import { userRoutes } from "./routes";

export default function UserPage() {
  return (
    <Routes>
      <Route path={userRoutes.list} element={<UserList />} />
      <Route path={userRoutes.detail} element={<UserDetail />} />
    </Routes>
  );
}
