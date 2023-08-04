import PropTypes from "prop-types";

function StaffInfo({ staff }) {
  return <div>{staff?.name}</div>;
}

export default StaffInfo;

StaffInfo.propTypes = {
  staff: PropTypes.bool.isRequired
};
