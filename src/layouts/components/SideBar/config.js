import {
  faBell,
  faCalendarAlt,
  faCalendarDays,
  faChartPie,
  faGear,
  faHospitalUser,
  faScrewdriverWrench,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    icon: <FontAwesomeIcon icon={faUsers} width={20} />
  },
  {
    id: USER,
    to: () => routeConfig.user,
    label: "user_label",
    icon: <FontAwesomeIcon icon={faUsers} width={20} />
  },
  {
    id: BOOKING,
    to: () => routeConfig.booking,
    label: "booking_label",
    icon: <FontAwesomeIcon icon={faHospitalUser} width={20} />
  },
  {
    id: PATIENT,
    to: () => routeConfig.patient,
    label: "patient_label",
    icon: <FontAwesomeIcon icon={faHospitalUser} width={20} />
  },
  {
    id: SCHEDULE,
    to: () => routeConfig.schedule,
    label: "schedule_label",
    icon: <FontAwesomeIcon icon={faCalendarDays} width={20} />
  },
  {
    id: SETTING,
    to: () => routeConfig.setting,
    label: "setting_label",
    icon: <FontAwesomeIcon icon={faGear} width={20} />
  },

  {
    id: EXPERTISE,
    to: () => routeConfig.expertise,
    label: "expertise_label",
    icon: <FontAwesomeIcon icon={faScrewdriverWrench} width={20} />
  },

  {
    id: NOTIFICATION,
    to: () => routeConfig.notification,
    label: "notification_label",
    icon: <FontAwesomeIcon icon={faBell} width={20} />
  },
  {
    id: RE_EXAMINATION,
    to: () => routeConfig.reExamination,
    label: "re_examination_label",
    icon: <FontAwesomeIcon icon={faCalendarAlt} width={20} />
  },
  {
    id: STATISTICS,
    to: () => routeConfig.statistics,
    label: "statistics_label",
    icon: <FontAwesomeIcon icon={faChartPie} width={20} />
  },
  {
    id: SUPPORT,
    to: () => routeConfig.support,
    label: "support_label",
    icon: <FontAwesomeIcon icon={faChartPie} width={20} />
  },
  {
    id: DOCTOR_CALENDAR,
    to: (doctorId) => `${routeConfig.staff}/${doctorId}/calendar`,
    label: "doctor_calendar_label",
    icon: <FontAwesomeIcon icon={faChartPie} width={20} />
  }
];
