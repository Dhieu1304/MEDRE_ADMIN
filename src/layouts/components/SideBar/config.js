import {
  faBell,
  faCalendarDays,
  faCalendarPlus,
  faCreditCard,
  faGear,
  faHospitalUser,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import routeConfig from "../../../config/routeConfig";

export const sideBarItems = [
  {
    to: routeConfig.staff,
    label: "staff_label",
    icon: <FontAwesomeIcon icon={faUsers} width={20} />
  },
  {
    to: routeConfig.user,
    label: "user_label",
    icon: <FontAwesomeIcon icon={faUsers} width={20} />
  },
  {
    to: routeConfig.booking,
    label: "booking_label",
    icon: <FontAwesomeIcon icon={faHospitalUser} width={20} />
  },
  {
    to: routeConfig.patient,
    label: "patient_label",
    icon: <FontAwesomeIcon icon={faHospitalUser} width={20} />
  },
  {
    to: routeConfig.payment,
    label: "payment_label",
    icon: <FontAwesomeIcon icon={faCreditCard} width={20} />
  },
  {
    to: routeConfig.schedule,
    label: "schedule_label",
    icon: <FontAwesomeIcon icon={faCalendarDays} width={20} />
  },
  {
    to: routeConfig.setting,
    label: "setting_label",
    icon: <FontAwesomeIcon icon={faGear} width={20} />
  },
  {
    to: routeConfig.meeting,
    label: "meeting_label",
    icon: <FontAwesomeIcon icon={faCalendarPlus} width={20} />
  },
  {
    to: routeConfig.notification,
    label: "notification_label",
    icon: <FontAwesomeIcon icon={faBell} width={20} />
  }
];
