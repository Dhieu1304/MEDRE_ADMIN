const staffRoutes = {
  list: "/",
  detail: "/:staffId",
  default: "/*"
};

const staffDetailRoutes = {
  detail: "/",
  calendar: "/calendar",
  schedule: "/schedule",
  addSchedule: "/addSchedule",
  timeOff: "/timeOff",
  default: "/*"
};

export { staffRoutes, staffDetailRoutes };
