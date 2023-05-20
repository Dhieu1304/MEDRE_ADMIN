const authApi = {
  loginByEmail: () => "/auth/staff/login-by-email",
  loginByPhoneNumber: () => "/auth/staff/login-by-phone-number",
  loginByUsername: () => "/auth/staff/login-by-username"
};

const userApi = {
  userList: () => "/user/list",
  userDetail: (id) => `/user/detail/${id}`,
  editUser: (id) => `/user/edit/${id}`,
  blockUser: () => `/staff/confirm-blocking`,
  unblockUser: () => `/staff/confirm-unblocking`
};
const staffApi = {
  createStaff: () => "/staff/create",
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
  book: () => "/booking/new-booking",
  bookingDetail: (id) => `/booking/detail-for-staff/${id}`
};

const patientApi = {
  createPatient: () => "/patient/create-for-staff",
  patientList: () => "/patient/list-for-staff",
  patientDetail: (id) => `/patient/detail-for-staff/${id}`
};

export { authApi, userApi, staffApi, scheduleApi, expertiseApi, timeOffApi, bookingApi, patientApi };
