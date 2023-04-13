export const staffInputValidate = {
  EMAIL_MAX_LENGTH: 50,
  USERNAME_MAX_LENGTH: 20,
  PHONE_NUMBER_MAX_LENGTH: 20,
  PASSWORD_MAX_LENGTH: 20,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MAX_LENGTH: 100,
  ADDRESS_MAX_LENGTH: 20,
  GENDER_MAX_LENGTH: 20,
  ROLE_MAX_LENGTH: 20,
  HEALTH_INSURANCE_MAX_LENGTH: 100,
  STATUS_MAX_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 500,
  EDUCATION_MAX_LENGTH: 500,
  CERTIFICATE_MAX_LENGTH: 500
};

export const staffRoles = {
  ROLE_ADMIN: "Admin",
  ROLE_DOCTOR: "Doctor",
  ROLE_NURSE: "Nurse",
  ROLE_CUSTOMER_SERVICE: "Customer_Service"
};

export const staffGenders = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other"
};

export const staffStatus = {
  STATUS_BLOCK: "Block",
  STATUS_UNBLOCK: "Unblock"
};

export const staffActionAbility = {
  READ: "READ",
  DELETE: "DELETE",
  UPDATE: "UPDATE",
  UPDATE_ROLE: "UPDATE_ROLE",
  BLOCK: "BLOCK"
};
