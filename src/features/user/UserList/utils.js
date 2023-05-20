import { normalizeStrToInt, normalizeStrToStr } from "../../../utils/standardizedForForm";

/*
 * columnsIds is used to generate IDs for the columns of the table (columns) and showCols
 * So when we need to change the ID name of the colums,
 *  we only need to change value of key the columnsIds
 *  then the keys of showCols are also changed.
 */
export const columnsIds = {
  phoneNumber: "phoneNumber",
  email: "email",
  name: "name",
  address: "address",
  gender: "gender",
  dob: "dob",
  healthInsurance: "healthInsurance",
  role: "role",
  status: "status",
  action: "action"
};

/*
    - Generate YYY from XXX, remove "action" because it must appear in the table
    - The rest of the keys will default to true
*/

export const initialShowCols = Object.keys(columnsIds).reduce((obj, key) => {
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
  name,
  address,
  healthInsurance,
  status,
  gender,
  page,
  limit
} = {}) => {
  const result = {
    email: normalizeStrToStr(email),
    phoneNumber: normalizeStrToStr(phoneNumber),
    name: normalizeStrToStr(name),
    address: normalizeStrToStr(address),
    healthInsurance: normalizeStrToStr(healthInsurance),
    status: normalizeStrToStr(status),
    gender: normalizeStrToStr(gender),

    page: normalizeStrToInt(page, 1),
    limit: normalizeStrToInt(limit, 10)
  };

  return result;
};
