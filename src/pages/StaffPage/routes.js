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
  addSchedule: "/addSchedule",
  timeOff: "/timeOff"
};

export { staffRoutes, staffDetailRoutes };
