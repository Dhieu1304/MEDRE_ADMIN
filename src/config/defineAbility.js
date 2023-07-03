import { defineAbility } from "@casl/ability";
import { staffActionAbility, staffRoles } from "../entities/Staff";
import { userActionAbility } from "../entities/User";
import { scheduleActionAbility } from "../entities/Schedule";
import { bookingActionAbility } from "../entities/Booking";
import { timeOffActionAbility } from "../entities/TimeOff";
import { patientActionAbility } from "../entities/Patient";
import { expertiseActionAbility } from "../entities/Expertise";
import entities from "../entities/entities";
import { settingActionAbility } from "../entities/Setting";
import { notificationActionAbility } from "../entities/Notification/constant";
import { reExaminationActionAbility } from "../entities/ReExamination";
import { ticketActionAbility } from "../entities/Ticket";

const defineAbilityFor = (staff) => {
  const {
    BOOKING,
    EXPERTISE,
    NOTIFICATION,
    PATIENT,
    SCHEDULE,
    SETTING,
    STAFF,
    // STATISTICS,
    TIMEOFF,
    USER,
    // TIME
    RE_EXAMINATION,
    TICKET
  } = entities;

  return defineAbility((can, cannot) => {
    const role = staff?.role;

    switch (role) {
      case staffRoles.ROLE_ADMIN:
        // can("run", STAFF);
        // can("manage", "all");

        // Staff
        // VIEW_ALL;
        // VIEW;
        // ADD;
        // DELETE;
        // UPDATE;
        // UPDATE_ROLE;
        // UPDATE_DOCTOR_EXPERTISES;
        // ADD_DOCTOR_TIMEOFF;
        // UPDATE_DOCTOR_TIMEOFF;
        // DELETE_DOCTOR_TIMEOFF;
        // BLOCK;

        can(staffActionAbility.VIEW_ALL, STAFF);
        can(staffActionAbility.VIEW, STAFF);
        can(staffActionAbility.ADD, STAFF);
        can(staffActionAbility.DELETE, STAFF, {
          role: { $ne: staffRoles.ROLE_ADMIN }
        });
        can(staffActionAbility.BLOCK, STAFF, {
          role: { $ne: staffRoles.ROLE_ADMIN }
        });
        can(staffActionAbility.UPDATE, STAFF);
        can(staffActionAbility.UPDATE_ROLE, STAFF, {
          role: { $ne: staffRoles.ROLE_ADMIN }
        });
        can(staffActionAbility.UPDATE_DOCTOR_EXPERTISES, STAFF, {
          role: staffRoles.ROLE_DOCTOR
        });
        cannot(staffActionAbility.ADD_DOCTOR_TIMEOFF, STAFF);
        can(staffActionAbility.UPDATE_DOCTOR_TIMEOFF, STAFF, {
          role: staffRoles.ROLE_DOCTOR
        });

        can(staffActionAbility.DELETE_DOCTOR_TIMEOFF, STAFF, {
          role: staffRoles.ROLE_DOCTOR
        });

        // EXPERTISE
        can(expertiseActionAbility.VIEW_ALL, EXPERTISE);
        can(expertiseActionAbility.VIEW, EXPERTISE);
        can(expertiseActionAbility.ADD, EXPERTISE);
        can(expertiseActionAbility.UPDATE, EXPERTISE);

        // User
        can(userActionAbility.VIEW_ALL, USER);
        can(userActionAbility.VIEW, USER);
        can(userActionAbility.BLOCK, USER);
        can(userActionAbility.DELETE, USER);
        can(userActionAbility.UPDATE, USER);

        // Schedule
        can(scheduleActionAbility.VIEW_ALL, SCHEDULE);
        can(scheduleActionAbility.VIEW, SCHEDULE);
        can(scheduleActionAbility.UPDATE, SCHEDULE);
        can(scheduleActionAbility.ADD, SCHEDULE);

        // TimeOff
        can(timeOffActionAbility.VIEW, TIMEOFF);
        can(timeOffActionAbility.ADD, TIMEOFF);

        // Booking
        can(bookingActionAbility.VIEW_ALL, BOOKING);
        can(bookingActionAbility.VIEW, BOOKING);
        cannot(bookingActionAbility.UPDATE, BOOKING);
        cannot(bookingActionAbility.UPDATE_CONCLUSION, BOOKING);
        cannot(bookingActionAbility.CANCEL, BOOKING);
        cannot(bookingActionAbility.ADD, BOOKING);

        // Patient
        can(patientActionAbility.VIEW, PATIENT);
        can(patientActionAbility.BLOCK, PATIENT);
        can(patientActionAbility.DELETE, PATIENT);
        can(patientActionAbility.UPDATE, PATIENT);

        // Setting
        can(settingActionAbility.VIEW, SETTING);
        can(settingActionAbility.UPDATE, SETTING);

        // Notification
        can(notificationActionAbility.ADD, NOTIFICATION);

        // ReExamination
        can(reExaminationActionAbility.VIEW_ALL, RE_EXAMINATION);
        cannot(reExaminationActionAbility.UPDATE, RE_EXAMINATION);

        // TICKET
        cannot(ticketActionAbility.VIEW_ALL, TICKET);
        cannot(ticketActionAbility.VIEW, TICKET);
        cannot(ticketActionAbility.UPDATE, TICKET);
        cannot(ticketActionAbility.RESPONSE, TICKET);

        break;
      case staffRoles.ROLE_DOCTOR:
        // STAFF
        cannot(staffActionAbility.VIEW_ALL, STAFF);
        can(staffActionAbility.VIEW, STAFF);
        cannot(staffActionAbility.ADD, STAFF);
        cannot(staffActionAbility.DELETE, STAFF);
        cannot(staffActionAbility.BLOCK, STAFF);
        can(staffActionAbility.UPDATE, STAFF, {
          id: staff?.id
        });

        cannot(staffActionAbility.UPDATE_ROLE);
        cannot(staffActionAbility.UPDATE_DOCTOR_EXPERTISES, STAFF);
        can(staffActionAbility.ADD_DOCTOR_TIMEOFF, STAFF, {
          id: staff?.id
        });
        cannot(staffActionAbility.UPDATE_DOCTOR_TIMEOFF, STAFF);

        cannot(staffActionAbility.DELETE_DOCTOR_TIMEOFF, STAFF);

        /// //

        // EXPERTISE
        cannot(expertiseActionAbility.VIEW_ALL, EXPERTISE);
        cannot(expertiseActionAbility.VIEW, EXPERTISE);
        cannot(expertiseActionAbility.ADD, EXPERTISE);
        cannot(expertiseActionAbility.UPDATE, EXPERTISE);

        // User
        cannot(userActionAbility.VIEW_ALL, USER);
        can(userActionAbility.VIEW, USER);
        cannot(userActionAbility.BLOCK, USER);
        cannot(userActionAbility.DELETE, USER);
        cannot(userActionAbility.UPDATE, USER);
        // Schedule
        cannot(scheduleActionAbility.VIEW_ALL, SCHEDULE);
        cannot(scheduleActionAbility.VIEW, SCHEDULE);
        cannot(scheduleActionAbility.UPDATE, SCHEDULE);
        cannot(scheduleActionAbility.ADD, SCHEDULE);

        // TimeOff
        cannot(timeOffActionAbility.VIEW, TIMEOFF);
        cannot(timeOffActionAbility.ADD, TIMEOFF);

        // Booking
        can(bookingActionAbility.VIEW, BOOKING);
        can(bookingActionAbility.UPDATE_CONCLUSION, BOOKING, {
          "bookingSchedule?.idDoctor": staff.id
        });
        cannot(bookingActionAbility.UPDATE, BOOKING);
        cannot(bookingActionAbility.CANCEL, BOOKING);
        cannot(bookingActionAbility.ADD, BOOKING);

        // Patient
        can(patientActionAbility.VIEW, PATIENT);
        cannot(patientActionAbility.BLOCK, PATIENT);
        cannot(patientActionAbility.DELETE, PATIENT);
        cannot(patientActionAbility.UPDATE, PATIENT);

        // Setting
        cannot(settingActionAbility.VIEW, SETTING);
        cannot(settingActionAbility.UPDATE, SETTING);

        // Notification
        cannot(notificationActionAbility.ADD, NOTIFICATION);

        // ReExamination
        cannot(reExaminationActionAbility.VIEW_ALL, RE_EXAMINATION);
        cannot(reExaminationActionAbility.UPDATE, RE_EXAMINATION);

        // TICKET
        cannot(ticketActionAbility.VIEW_ALL, TICKET);
        cannot(ticketActionAbility.VIEW, TICKET);
        cannot(ticketActionAbility.UPDATE, TICKET);
        cannot(ticketActionAbility.RESPONSE, TICKET);
        break;

      case staffRoles.ROLE_NURSE:
        // can("run", STAFF, {
        //   id: staff?.id
        // });
        // STAFF
        can(staffActionAbility.VIEW_ALL, STAFF);
        can(staffActionAbility.VIEW, STAFF);
        cannot(staffActionAbility.ADD, STAFF);
        cannot(staffActionAbility.DELETE, STAFF);
        cannot(staffActionAbility.BLOCK, STAFF);
        can(staffActionAbility.UPDATE, STAFF, {
          id: staff?.id
        });

        cannot(staffActionAbility.UPDATE_ROLE);
        cannot(staffActionAbility.UPDATE_DOCTOR_EXPERTISES, STAFF);
        cannot(staffActionAbility.ADD_DOCTOR_TIMEOFF, STAFF);
        cannot(staffActionAbility.UPDATE_DOCTOR_TIMEOFF, STAFF);
        cannot(staffActionAbility.DELETE_DOCTOR_TIMEOFF, STAFF);

        /// //

        // EXPERTISE
        cannot(expertiseActionAbility.VIEW_ALL, EXPERTISE);
        cannot(expertiseActionAbility.VIEW, EXPERTISE);
        cannot(expertiseActionAbility.ADD, EXPERTISE);
        cannot(expertiseActionAbility.UPDATE, EXPERTISE);

        // User
        can(userActionAbility.VIEW_ALL, USER);
        can(userActionAbility.VIEW, USER);
        cannot(userActionAbility.BLOCK, USER);
        cannot(userActionAbility.DELETE, USER);
        cannot(userActionAbility.UPDATE, USER);
        // Schedule
        can(scheduleActionAbility.VIEW_ALL, SCHEDULE);
        can(scheduleActionAbility.VIEW, SCHEDULE);
        cannot(scheduleActionAbility.UPDATE, SCHEDULE);
        cannot(scheduleActionAbility.ADD, SCHEDULE);

        // TimeOff
        cannot(timeOffActionAbility.VIEW, TIMEOFF);
        cannot(timeOffActionAbility.ADD, TIMEOFF);

        // Booking
        can(bookingActionAbility.VIEW, BOOKING);
        cannot(bookingActionAbility.UPDATE_CONCLUSION, BOOKING);
        can(bookingActionAbility.UPDATE, BOOKING);
        can(bookingActionAbility.CANCEL, BOOKING);
        can(bookingActionAbility.ADD, BOOKING);

        // Patient
        can(patientActionAbility.VIEW, PATIENT);
        cannot(patientActionAbility.BLOCK, PATIENT);
        cannot(patientActionAbility.DELETE, PATIENT);
        cannot(patientActionAbility.UPDATE, PATIENT);

        // Setting
        cannot(settingActionAbility.VIEW, SETTING);
        cannot(settingActionAbility.UPDATE, SETTING);

        // Notification
        cannot(notificationActionAbility.ADD, NOTIFICATION);

        // ReExamination
        can(reExaminationActionAbility.VIEW_ALL, RE_EXAMINATION);
        can(reExaminationActionAbility.UPDATE, RE_EXAMINATION);

        // TICKET
        can(ticketActionAbility.VIEW_ALL, TICKET);
        can(ticketActionAbility.VIEW, TICKET);
        can(ticketActionAbility.UPDATE, TICKET);
        can(ticketActionAbility.RESPONSE, TICKET);

        break;

      case staffRoles.ROLE_CUSTOMER_SERVICE:
        // can("run", STAFF, {
        //   id: staff?.id
        // });
        // STAFF
        can(staffActionAbility.VIEW_ALL, STAFF);
        can(staffActionAbility.VIEW, STAFF);
        cannot(staffActionAbility.ADD, STAFF);
        cannot(staffActionAbility.DELETE, STAFF);
        cannot(staffActionAbility.BLOCK, STAFF);
        can(staffActionAbility.UPDATE, STAFF, {
          id: staff?.id
        });

        cannot(staffActionAbility.UPDATE_ROLE);
        cannot(staffActionAbility.UPDATE_DOCTOR_EXPERTISES, STAFF);
        cannot(staffActionAbility.ADD_DOCTOR_TIMEOFF, STAFF);
        cannot(staffActionAbility.UPDATE_DOCTOR_TIMEOFF, STAFF);
        cannot(staffActionAbility.DELETE_DOCTOR_TIMEOFF, STAFF);

        /// //

        // EXPERTISE
        cannot(expertiseActionAbility.VIEW_ALL, EXPERTISE);
        cannot(expertiseActionAbility.VIEW, EXPERTISE);
        cannot(expertiseActionAbility.ADD, EXPERTISE);
        cannot(expertiseActionAbility.UPDATE, EXPERTISE);

        // User
        can(userActionAbility.VIEW_ALL, USER);
        can(userActionAbility.VIEW, USER);
        cannot(userActionAbility.BLOCK, USER);
        cannot(userActionAbility.DELETE, USER);
        cannot(userActionAbility.UPDATE, USER);
        // Schedule
        can(scheduleActionAbility.VIEW_ALL, SCHEDULE);
        can(scheduleActionAbility.VIEW, SCHEDULE);
        cannot(scheduleActionAbility.UPDATE, SCHEDULE);
        cannot(scheduleActionAbility.ADD, SCHEDULE);

        // TimeOff
        cannot(timeOffActionAbility.VIEW, TIMEOFF);
        cannot(timeOffActionAbility.ADD, TIMEOFF);

        // Booking
        can(bookingActionAbility.VIEW, BOOKING);
        cannot(bookingActionAbility.UPDATE_CONCLUSION, BOOKING);
        can(bookingActionAbility.UPDATE, BOOKING);
        can(bookingActionAbility.CANCEL, BOOKING);
        can(bookingActionAbility.ADD, BOOKING);

        // Patient
        can(patientActionAbility.VIEW, PATIENT);
        cannot(patientActionAbility.BLOCK, PATIENT);
        cannot(patientActionAbility.DELETE, PATIENT);
        cannot(patientActionAbility.UPDATE, PATIENT);

        // Setting
        cannot(settingActionAbility.VIEW, SETTING);
        cannot(settingActionAbility.UPDATE, SETTING);

        // Notification
        cannot(notificationActionAbility.ADD, NOTIFICATION);

        // ReExamination
        can(reExaminationActionAbility.VIEW_ALL, RE_EXAMINATION);
        can(reExaminationActionAbility.UPDATE, RE_EXAMINATION);

        // TICKET
        can(ticketActionAbility.VIEW_ALL, TICKET);
        can(ticketActionAbility.VIEW, TICKET);
        can(ticketActionAbility.UPDATE, TICKET);
        can(ticketActionAbility.RESPONSE, TICKET);

        break;
      default:
        cannot("manage", "all");
        break;
    }
  });
};

export default defineAbilityFor;
