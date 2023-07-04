import { normalizeStrToDateStr, normalizeStrToInt, normalizeStrToStr } from "../../../utils/standardizedForForm";

/*
 * columnsIds is used to generate IDs for the columns of the table (columns) and showCols
 * So when we need to change the ID name of the colums,
 *  we only need to change value of key the columnsIds
 *  then the keys of showCols are also changed.
 */
export const columnsIds = {
  // dateRemind: "dateRemind",
  dateReExam: "dateReExam",
  isRemind: "isRemind",
  // isApply: "isApply",
  bookingDate: "bookingDate",
  bookingUserPhoneNumber: "bookingUserPhoneNumber",
  bookingUserEmail: "bookingUserEmail",
  bookingUserName: "bookingUserName",
  action: "action"
};

/*
    - Generate YYY from XXX, remove "action" because it must appear in the table
    - The rest of the keys will default to true
*/

export const initialShowCols = Object.keys(columnsIds).reduce((obj, key) => {
  if (key === columnsIds.action || key === columnsIds.bookingUserName) {
    return { ...obj };
  }
  return { ...obj, [key]: true };
}, {});

/*
    - From the object's keys in the parameter
    - we will reformat the correct format to be the value for the input in the filter form
*/
export const createDefaultValues = ({ isRemind, dateReExam, page, limit } = {}) => {
  const result = {
    // isApply: normalizeStrToStr(isApply),
    isRemind: normalizeStrToStr(isRemind),
    // idStaffRemind: normalizeStrToStr(idStaffRemind),
    // dateRemind: normalizeStrToDateStr(dateRemind),
    dateReExam: normalizeStrToDateStr(dateReExam),

    page: normalizeStrToInt(page, 1),
    limit: normalizeStrToInt(limit, 10)
  };

  return result;
};
