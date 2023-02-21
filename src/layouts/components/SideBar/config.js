import { faCalendarDays, faCalendarPlus, faCreditCard, faHospitalUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import routeConfig from "../../../config/routeConfig";

export const sideBarItems = [
  {
    to: routeConfig.user,
    label: "User",
    icon: <FontAwesomeIcon icon={faUsers} size="1x" />
  },
  {
    to: routeConfig.home,
    label: "Patient",
    icon: <FontAwesomeIcon icon={faHospitalUser} size="1x" />
  },
  {
    to: routeConfig.home,
    label: "Payment",
    icon: <FontAwesomeIcon icon={faCreditCard} size="1x" />
  },
  {
    to: routeConfig.home,
    label: "Schedule",
    icon: <FontAwesomeIcon icon={faCalendarDays} size="1x" />
  },
  {
    to: routeConfig.home,
    label: "Booking",
    icon: <FontAwesomeIcon icon={faCalendarPlus} size="1x" />
  }
];
