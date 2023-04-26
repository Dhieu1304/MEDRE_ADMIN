const authApi = {
  loginByEmail: "/auth/staff/login-by-email"
};

const userApi = {
  userList: () => "/user/list",
  userDetail: (id) => `/user/detail/${id}`,
  editUser: (id) => `/user/edit/${id}`
};
const staffApi = {
  staffInfo: () => "/staff/my-profile",
  staffList: () => "/staff/all",
  staffListWithSchedules: () => "/staff/list-staff-schedule",
  staffDetail: (id) => `/staff/detail/${id}`,
  editStaff: (id) => `/staff/edit/${id}`,
  editMyProfile: () => `/staff/my-profile/edit`,
  blockStaff: () => `/staff/confirm-blocking`,
  unblockStaff: () => `/staff/confirm-unblocking`
};

const expertiseApi = {
  expertiseList: () => "/expertise/list",
  createExpertise: () => "/expertise/create-expertise"
};

const scheduleApi = {
  scheduleList: () => "/schedule/list-all",
  timeList: () => "/time-schedule/time",
  createSchedule: () => "/schedule/create-schedule",
  changeApplyTo: () => "/schedule/change-apply-to-id"
};

const timeOffApi = {
  timeOffList: () => "/doctor-time-off/time-off",
  createTimeOff: () => "/doctor-time-off/create-time-off"
};

const bookingApi = {
  bookingDetail: (id) => `/booking/detail-for-staff/${id}`
};

export { authApi, userApi, staffApi, scheduleApi, expertiseApi, timeOffApi, bookingApi };
