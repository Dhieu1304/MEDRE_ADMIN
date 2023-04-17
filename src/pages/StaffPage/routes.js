const staffRoutes = {
  list: "/",
  detail: "/:staffId",
  // /:staffId/schedule
  default: "/*"
};

const staffDetailRoutes = {
  detail: "/",
  schedule: "/schedule",
  timeOff: "/timeOff"
};

export { staffRoutes, staffDetailRoutes };
