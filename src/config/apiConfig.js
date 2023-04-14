const authApi = {
  loginByEmail: "/auth/staff/login-by-email"
};

const userApi = {
  userList: () => "/user/list"
};
const staffApi = {
  staffInfo: () => "/staff/my-profile",
  staffList: () => "/staff/all",
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
  schedule: () => "/schedule",
  timeList: () => "/time-schedule/time"
};

export { authApi, userApi, staffApi, scheduleApi, expertiseApi };
