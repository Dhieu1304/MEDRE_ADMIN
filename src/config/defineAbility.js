import { defineAbility } from "@casl/ability";
import Staff, { staffRoles, staffActionAbility } from "../entities/Staff";
import User, { userActionAbility } from "../entities/User";
import Schedule, { scheduleActionAbility } from "../entities/Schedule";
import Booking, { bookingActionAbility } from "../entities/Booking";
import TimeOff, { timeOffActionAbility } from "../entities/TimeOff";
import Patient, { patientActionAbility } from "../entities/Patient";
import Expertise, { expertiseActionAbility } from "../entities/Expertise";

const defineAbilityFor = (staff) => {
  const STAFF = Staff.magicWord();
  const USER = User.magicWord();
  const EXPERTISE = Expertise.magicWord();
  const SCHEDULE = Schedule.magicWord();
  const BOOKING = Booking.magicWord();
  const TIMEOFF = TimeOff.magicWord();
  const PATIENT = Patient.magicWord();

  return defineAbility((can, cannot) => {
    const role = staff?.role;
    switch (role) {
      case staffRoles.ROLE_ADMIN:
        can("manage", "all");
        break;

      case staffRoles.ROLE_DOCTOR:
        // STAFF
        can(staffActionAbility.VIEW, STAFF);
        can(staffActionAbility.UPDATE, STAFF, {
          id: staff?.id
        });

        cannot(staffActionAbility.BLOCK, STAFF);
        cannot(staffActionAbility.DELETE, STAFF);
        cannot(staffActionAbility.UPDATE_ROLE, STAFF);
        cannot(staffActionAbility.UPDATE_DOCTOR_EXPERTISES, STAFF);
        cannot(staffActionAbility.ADD, STAFF);

        // EXPERTISE
        can(expertiseActionAbility.VIEW, EXPERTISE);

        cannot(expertiseActionAbility.ADD, EXPERTISE);
        cannot(expertiseActionAbility.UPDATE, EXPERTISE);

        // User
        can(userActionAbility.VIEW, USER);
        cannot(userActionAbility.BLOCK, USER);
        cannot(userActionAbility.DELETE, USER);
        cannot(userActionAbility.UPDATE, USER);

        // Schedule
        can(scheduleActionAbility.VIEW, SCHEDULE);

        cannot(scheduleActionAbility.UPDATE, SCHEDULE);
        cannot(scheduleActionAbility.ADD, SCHEDULE);

        // TimeOff
        can(timeOffActionAbility.VIEW, TIMEOFF);
        can(timeOffActionAbility.ADD, TIMEOFF);

        // Booking
        can(bookingActionAbility.VIEW, BOOKING);
        can(bookingActionAbility.UPDATE_CONCLUSION, BOOKING);

        cannot(bookingActionAbility.UPDATE, BOOKING);
        cannot(bookingActionAbility.CANCEL, BOOKING);
        cannot(bookingActionAbility.ADD, BOOKING);

        // Patient
        can(patientActionAbility.VIEW, PATIENT);
        cannot(patientActionAbility.BLOCK, PATIENT);
        cannot(patientActionAbility.DELETE, PATIENT);
        cannot(patientActionAbility.UPDATE, PATIENT);

        break;

      case staffRoles.ROLE_NURSE:
        // STAFF
        can(staffActionAbility.VIEW, STAFF);
        can(staffActionAbility.UPDATE, STAFF, {
          id: staff?.id
        });

        cannot(staffActionAbility.BLOCK, STAFF);
        cannot(staffActionAbility.DELETE, STAFF);
        cannot(staffActionAbility.UPDATE_ROLE, STAFF);
        cannot(staffActionAbility.UPDATE_DOCTOR_EXPERTISES, STAFF);
        cannot(staffActionAbility.ADD, STAFF);

        // EXPERTISE
        can(expertiseActionAbility.VIEW, EXPERTISE);

        cannot(expertiseActionAbility.ADD, EXPERTISE);
        cannot(expertiseActionAbility.UPDATE, EXPERTISE);

        // User
        can(userActionAbility.VIEW, USER);
        cannot(userActionAbility.BLOCK, USER);
        cannot(userActionAbility.DELETE, USER);
        cannot(userActionAbility.UPDATE, USER);

        // Schedule
        can(scheduleActionAbility.VIEW, SCHEDULE);

        cannot(scheduleActionAbility.UPDATE, SCHEDULE);
        cannot(scheduleActionAbility.ADD, SCHEDULE);

        // TimeOff
        can(timeOffActionAbility.VIEW, TIMEOFF);
        cannot(timeOffActionAbility.ADD, TIMEOFF);

        // Booking
        can(bookingActionAbility.VIEW, BOOKING);

        cannot(bookingActionAbility.UPDATE_CONCLUSION, BOOKING);
        cannot(bookingActionAbility.UPDATE, BOOKING);
        cannot(bookingActionAbility.CANCEL, BOOKING);
        cannot(bookingActionAbility.ADD, BOOKING);

        // Patient
        can(patientActionAbility.VIEW, PATIENT);
        cannot(patientActionAbility.BLOCK, PATIENT);
        cannot(patientActionAbility.DELETE, PATIENT);
        cannot(patientActionAbility.UPDATE, PATIENT);

        break;

      case staffRoles.ROLE_CUSTOMER_SERVICE:
        // STAFF
        can(staffActionAbility.VIEW, STAFF);
        can(staffActionAbility.UPDATE, STAFF, {
          id: staff?.id
        });

        cannot(staffActionAbility.BLOCK, STAFF);
        cannot(staffActionAbility.DELETE, STAFF);
        cannot(staffActionAbility.UPDATE_ROLE, STAFF);
        cannot(staffActionAbility.UPDATE_DOCTOR_EXPERTISES, STAFF);
        cannot(staffActionAbility.ADD, STAFF);

        // EXPERTISE
        can(expertiseActionAbility.VIEW, EXPERTISE);

        cannot(expertiseActionAbility.ADD, EXPERTISE);
        cannot(expertiseActionAbility.UPDATE, EXPERTISE);

        // User
        can(userActionAbility.VIEW, USER);
        cannot(userActionAbility.BLOCK, USER);
        cannot(userActionAbility.DELETE, USER);
        cannot(userActionAbility.UPDATE, USER);

        // Schedule
        can(scheduleActionAbility.VIEW, SCHEDULE);

        cannot(scheduleActionAbility.UPDATE, SCHEDULE);
        cannot(scheduleActionAbility.ADD, SCHEDULE);

        // TimeOff
        can(timeOffActionAbility.VIEW, TIMEOFF);
        cannot(timeOffActionAbility.ADD, TIMEOFF);

        // Booking
        can(bookingActionAbility.VIEW, BOOKING);
        can(bookingActionAbility.UPDATE, BOOKING);
        can(bookingActionAbility.CANCEL, BOOKING);
        can(bookingActionAbility.ADD, BOOKING);

        cannot(bookingActionAbility.UPDATE_CONCLUSION, BOOKING);

        // Patient
        can(patientActionAbility.VIEW, PATIENT);

        cannot(patientActionAbility.BLOCK, PATIENT);
        cannot(patientActionAbility.DELETE, PATIENT);
        cannot(patientActionAbility.UPDATE, PATIENT);

        break;
      default:
        cannot("manage", "all");
        break;
    }
  });
};

export default defineAbilityFor;
