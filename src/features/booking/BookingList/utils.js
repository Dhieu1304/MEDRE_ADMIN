import { bookingPaymentStatuses, bookingStatuses as bookingStatusesConstants } from "../../../entities/Booking";
import { staffRoles } from "../../../entities/Staff";
import { removeKeys } from "../../../utils/objectUtil";
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
  patientName: "patientName",
  patientPhoneNumber: "patientPhoneNumber",
  doctorName: "doctorName",
  date: "date",
  time: "time",
  type: "type",
  expertise: "expertise",
  ordinalNumber: "ordinalNumber",
  status: "status",
  paymentStatus: "paymentStatus",
  action: "action"
};

export const hideColsByRole = (role) => {
  // console.log("role: ", role);
  switch (role) {
    case staffRoles.ROLE_DOCTOR:
      return {
        patientPhoneNumber: false,
        expertise: false,
        // doctorName: false,
        status: false,
        paymentStatus: false
      };

    default:
      return {
        patientPhoneNumber: false,
        expertise: false
      };
  }
};

/*
    - Generate YYY from XXX, remove "action" because it must appear in the table
    - The rest of the keys will default to true
*/

export const initialShowCols = Object.keys(columnsIds).reduce((obj, key) => {
  if (key === columnsIds.action || key === columnsIds.patientName) {
    return { ...obj };
  }
  return { ...obj, [key]: true };
}, {});

/*
    - From the object's keys in the parameter
    - we will reformat the correct format to be the value for the input in the filter form
*/

export const fixedFiltersByStaffRole = (staff) => {
  const role = staff?.role;
  const staffId = staff?.id;

  const defaultHide = {
    staffBookingId: undefined,
    staffCancelId: undefined
  };

  switch (role) {
    case staffRoles.ROLE_DOCTOR:
      return {
        ...defaultHide,
        doctorId: staffId,
        isPayment: bookingPaymentStatuses.PAID,
        bookingStatuses: [bookingStatusesConstants.BOOKED],
        userId: undefined
      };

    default:
      return { ...defaultHide };
  }
};

export const createDefaultValues = (
  {
    patientPhoneNumber,
    userId,
    patientId,
    doctorId,
    staffBookingId,
    staffCancelId,
    type,
    isPayment,
    from,
    to,
    bookingStatuses,
    page,
    limit
  } = {},
  staff = null
) => {
  const defaultValuesInUrl = {
    patientPhoneNumber: normalizeStrToStr(patientPhoneNumber),
    userId: normalizeStrToStr(userId),
    patientId: normalizeStrToStr(patientId),
    doctorId: normalizeStrToStr(doctorId),
    staffBookingId: normalizeStrToStr(staffBookingId),
    staffCancelId: normalizeStrToStr(staffCancelId),
    type: normalizeStrToStr(type),
    isPayment: normalizeStrToStr(isPayment),
    from: normalizeStrToDateStr(from),
    to: normalizeStrToDateStr(to),
    bookingStatuses: normalizeStrToArray(bookingStatuses),
    page: normalizeStrToInt(page, 1),
    limit: normalizeStrToInt(limit, 10)
  };

  const result = removeKeys(defaultValuesInUrl, fixedFiltersByStaffRole(staff));

  return result;
};
