import { faCalendarDays, faCalendarPlus, faCreditCard, faHospitalUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import routeConfig from "../../../config/routeConfig";

export const sideBarItems = [
  {
    to: routeConfig.staff,
    label: "staff_label",
    icon: <FontAwesomeIcon icon={faUsers} width={20} />
  },
  {
    to: routeConfig.home,
    label: "user_label",
    icon: <FontAwesomeIcon icon={faUsers} width={20} />
  },
  {
    to: routeConfig.home,
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
    to: routeConfig.home,
    label: "booking_label",
    icon: <FontAwesomeIcon icon={faCalendarPlus} width={20} />
  },
  {
    to: routeConfig.meeting,
    label: "meeting_label",
    icon: <FontAwesomeIcon icon={faCalendarPlus} width={20} />
  }
];
