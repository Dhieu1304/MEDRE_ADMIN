const authApi = {
  loginByEmail: () => "/auth/staff/login-by-email",
  loginByPhoneNumber: () => "/auth/staff/login-by-phone-number",
  loginByUsername: () => "/auth/staff/login-by-username",

  sendVerificationToEmail: () => "/auth/verify/resend-mail",
  sendResetPasswordToEmail: () => "/auth/reset-password/send-mail",
  sendVerificationOtpToPhone: () => "",
  sendResetPasswordOtpToPhone: () => "",

  verifyOtpToVerfifyPhoneNumber: () => "",
  verifyOtpToResetPasswordPhoneNumber: () => ""
};

const userApi = {
  userList: () => "/user/list",
  userDetail: (id) => `/user/detail/${id}`,
  editUser: (id) => `/user/edit/${id}`,
  blockUser: () => `/staff/confirm-blocking`,
  unblockUser: () => `/staff/confirm-unblocking`
};
const staffApi = {
  staffInfo: () => "/staff/my-profile",
  staffList: () => "/staff/all",
  createStaff: () => "staff/create",
  staffListWithSchedules: () => "/staff/list-staff-schedule",
  staffDetail: (id) => `/staff/detail/${id}`,
  editStaff: (id) => `/staff/edit/${id}`,
  editMyProfile: () => `/staff/my-profile/edit`,
  blockStaff: () => `/staff/confirm-blocking`,
  unblockStaff: () => `/staff/confirm-unblocking`,
  changePassword: () => "/staff/my-profile/change-password"
};

const expertiseApi = {
  expertiseList: () => "/expertise/list",
  createExpertise: () => "/expertise/create-expertise"
};

const scheduleApi = {
  scheduleList: () => "/schedule/list-all",
  timeList: () => "/time-schedule/time",
  createSchedule: () => "/schedule/create-schedule",
  changeApplyTo: () => "/schedule/change-apply-to-id",
  deleteSchedules: () => "/schedule/delete-schedule"
};

const timeOffApi = {
  timeOffList: () => "/doctor-time-off/time-off",
  createTimeOff: () => "/doctor-time-off/create-time-off",
  editTimeOff: () => "/doctor-time-off/edit-time-off",
  deleteTimeOff: () => "/doctor-time-off/delete-time-off"
};

const bookingApi = {
  book: () => "/booking/create-booking-for-staff",
  bookingList: () => "/booking/list-for-staff",
  bookingDetail: (id) => `/booking/detail-for-staff/${id}`,
  updateBooking: () => `/booking/update`,
  updateBookingByDoctor: () => "/booking/update-for-doctor",
  getCountBookingSchedule: () => "/booking/schedule-booking-count",
  getCountBookingScheduleByManyStaff: () => "/booking/schedule-booking-count-many-staff"
};

const patientApi = {
  createPatient: () => "/patient/create-for-staff",
  patientList: () => "/patient/list-for-staff",
  patientDetail: (id) => `/patient/detail-for-staff/${id}`
};

const settingApi = {
  settingList: () => "/setting/list",
  editSetting: () => `/setting/edit`
};

const notificationApi = {
  notificationList: () => "/notification/list",
  notificationDetail: (id) => `/notification/detail/${id}`,
  markRead: () => "/notification/mark-read",
  countUnread: () => "/notification/count-unread",
  subscribeTopic: () => "/notification/subscribe-topic",
  unSubscribeTopic: () => "/notification/un-subscribe-topic",
  createNotification: () => "/notification/create"
};

const reExaminationApi = {
  reExaminationList: () => "/re-examination/list-for-staff",
  createReExamination: () => `/re-examination/create`,
  updateReExamination: () => `/re-examination/update`
};

const uploadApi = {
  upload: () => "/upload/avatar"
};

const scheduleBookingTimeApi = {
  scheduleBookingTimeList: () => "/schedule-booking-time/list"
};

export {
  authApi,
  userApi,
  staffApi,
  scheduleApi,
  expertiseApi,
  timeOffApi,
  bookingApi,
  patientApi,
  settingApi,
  notificationApi,
  reExaminationApi,
  uploadApi,
  scheduleBookingTimeApi
};
