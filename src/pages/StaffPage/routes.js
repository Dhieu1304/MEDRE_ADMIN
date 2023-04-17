const staffRoutes = {
  list: "/",
  detail: "/:staffId",
  // /:staffId/schedule
  default: "/*"
};

const staffDetailRoutes = {
  detail: "/",
  calendar: "/calendar",
  schedule: "/schedule",
  timeOff: "/timeOff"
};

export { staffRoutes, staffDetailRoutes };
