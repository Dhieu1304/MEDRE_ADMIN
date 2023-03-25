import { Checkbox } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

export const EMPTY = "EMPTY";
// export const BOOKED = "BOOKED";
// export const EMPTY_PAST = "EMPTY_PAST";
// export const RESERVED = "RESERVED";
// export const BUSY = "BUSY";

function ScheduleButton({ variant, onClick }) {
  const [isChecked, setIsChecked] = useState(false);

  const render = () => {
    switch (variant) {
      case EMPTY:
        return (
          <Checkbox
            onClick={() => {
              setIsChecked((prev) => !prev);
              onClick();
            }}
            checked={isChecked}
          />
        );

      default:
        return <div />;
    }
  };

  return render();
}

ScheduleButton.propTypes = {
  variant: PropTypes.string.isRequired
};

export default ScheduleButton;
