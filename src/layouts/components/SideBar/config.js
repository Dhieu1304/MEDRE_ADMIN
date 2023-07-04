import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PeopleIcon from "@mui/icons-material/People";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HotelIcon from "@mui/icons-material/Hotel";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import HelpIcon from "@mui/icons-material/Help";
import ScheduleIcon from "@mui/icons-material/Schedule";

import routeConfig from "../../../config/routeConfig";
import { sidebarActionAbility } from "../../../entities/Sidebar/constant";

const {
  STAFF,
  USER,
  PATIENT,
  BOOKING,
  SCHEDULE,
  SETTING,
  EXPERTISE,
  NOTIFICATION,
  RE_EXAMINATION,
  STATISTICS,
  DOCTOR_CALENDAR,
  SUPPORT
} = sidebarActionAbility;

export const sideBarItems = [
  {
    id: STAFF,
    to: () => routeConfig.staff,
    label: "staff_label",
    icon: <AccountBoxIcon width={20} />
  },
  {
    id: USER,
    to: () => routeConfig.user,
    label: "user_label",
    icon: <PeopleIcon width={20} />
  },
  {
    id: BOOKING,
    to: () => routeConfig.booking,
    label: "booking_label",
    icon: <LocalHospitalIcon width={20} />
  },
  {
    id: PATIENT,
    to: () => routeConfig.patient,
    label: "patient_label",
    icon: <HotelIcon width={20} />
  },
  {
    id: SCHEDULE,
    to: () => routeConfig.schedule,
    label: "schedule_label",
    icon: <CalendarMonthIcon width={20} />
  },
  {
    id: SETTING,
    to: () => routeConfig.setting,
    label: "setting_label",
    icon: <SettingsIcon width={20} />
  },

  {
    id: EXPERTISE,
    to: () => routeConfig.expertise,
    label: "expertise_label",
    icon: <ListAltIcon width={20} />
  },

  {
    id: NOTIFICATION,
    to: () => routeConfig.notification,
    label: "notification_label",
    icon: <NotificationsActiveIcon width={20} />
  },
  {
    id: RE_EXAMINATION,
    to: () => routeConfig.reExamination,
    label: "re_examination_label",
    icon: <EventAvailableIcon width={20} />
  },
  {
    id: STATISTICS,
    to: () => routeConfig.statistics,
    label: "re_statistics_label",
    icon: <AnalyticsIcon width={20} />
  },
  {
    id: SUPPORT,
    to: () => routeConfig.support,
    label: "support_label",
    icon: <HelpIcon width={20} />
  },
  {
    id: DOCTOR_CALENDAR,
    to: (doctorId) => `${routeConfig.staff}/${doctorId}/calendar`,
    label: "doctor_calendar_label",
    icon: <ScheduleIcon width={20} />
  }
];
