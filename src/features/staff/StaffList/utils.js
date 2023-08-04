import {
  normalizeStrToArray,
  normalizeStrToDateStr,
  normalizeStrToInt,
  normalizeStrToStr
} from "../../../utils/standardizedForForm";

/*
 * columnsIds is used to generate IDs for the columns of the table (columns) and showCols
 * So when we need to change the ID name of the colums,
 *  we only need to change value of key the columnsIds
 *  then the keys of showCols are also changed.
 */
export const columnsIds = {
  username: "username",
  phoneNumber: "phoneNumber",
  email: "email",
  name: "name",
  address: "address",
  gender: "gender",
  dob: "dob",
  healthInsurance: "healthInsurance",
  description: "description",
  education: "education",
  certificate: "certificate",
  role: "role",
  status: "status",
  action: "action"
};

export const initialShowCols = Object.keys(columnsIds).reduce((obj, key) => {
  // Bỏ qua key action và name
  if (key === columnsIds.action || key === columnsIds.name) {
    return { ...obj };
  }
  return { ...obj, [key]: true };
}, {});

/*
    - From the object's keys in the parameter
    - we will reformat the correct format to be the value for the input in the filter form
*/
export const createDefaultValues = ({
  email,
  phoneNumber,
  // username,
  name,
  // address,
  // healthInsurance,
  // description,
  // education,
  // certificate,
  // type,
  role,
  status,
  // gender,
  expertises,
  page,
  limit,
  from,
  to
} = {}) => {
  const result = {
    email: normalizeStrToStr(email),
    phoneNumber: normalizeStrToStr(phoneNumber),
    // username: normalizeStrToStr(username),
    name: normalizeStrToStr(name),
    // address: normalizeStrToStr(address),
    // healthInsurance: normalizeStrToStr(healthInsurance),
    // description: normalizeStrToStr(description),
    // education: normalizeStrToStr(education),
    // certificate: normalizeStrToStr(certificate),
    // type: normalizeStrToStr(type),
    role: normalizeStrToStr(role),
    status: normalizeStrToStr(status),
    // gender: normalizeStrToStr(gender),

    expertises: normalizeStrToArray(expertises),

    page: normalizeStrToInt(page, 1),
    limit: normalizeStrToInt(limit, 10),
    from: normalizeStrToDateStr(from),
    to: normalizeStrToDateStr(to)
  };

  return result;
};
