const staffRoutes = {
  list: "/",
  detail: "/:staffId",
  // /:staffId/schedule
  default: "/*"
};

const staffDetailRoutes = {
  detail: "/",
  schedule: "/schedule"
};

export { staffRoutes, staffDetailRoutes };
