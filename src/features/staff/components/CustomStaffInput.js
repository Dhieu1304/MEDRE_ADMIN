import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

import { Box, FormControl, FormHelperText, InputAdornment, InputLabel, TextField } from "@mui/material";
import { Children, cloneElement, isValidElement, useState } from "react";
import { Controller } from "react-hook-form";
import { inputErrorFormat } from "../../../utils/stringFormat";

function CustomStaffInput({ control, rules = {}, label, trigger, triggerTo, name, type = "text", placeholder, children }) {
  const [hidePassword, setHidePassword] = useState(true);

  const formControlStyle = {
    margin: 0,
    padding: 0
  };

  const render = ({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
    let inputType = type;
    if (type === "password") {
      inputType = hidePassword ? "password" : "text";
    }

    if (children) {
      return (
        <FormControl sx={formControlStyle} variant="outlined" fullWidth>
          <InputLabel variant="outlined" required={!!rules?.required}>
            <Box component="span">{label}</Box>
          </InputLabel>

          {/* add props for children
           https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children
           */}

          {Children.map(children, (child) => {
            if (isValidElement(child)) {
              return cloneElement(child, {
                label,
                error: !!error,
                value,
                onBlur: () => {
                  trigger(name, { shouldFocus: true });
                  onBlur();
                },
                onChange,
                placeholder
              });
            }
            return child;
          })}

          <FormHelperText>
            <Box component="span">{inputErrorFormat(label, error?.message)}</Box>
          </FormHelperText>
        </FormControl>
      );
    }

    const InputProps =
      type === "password"
        ? {
            endAdornment: (
              <InputAdornment position="end">
                <FontAwesomeIcon
                  size="1x"
                  icon={hidePassword ? faEye : faEyeSlash}
                  onClick={() => setHidePassword((prev) => !prev)}
                  cursor="pointer"
                />
              </InputAdornment>
            )
          }
        : undefined;

    return (
      <Box
        component={TextField}
        fullWidth
        InputProps={InputProps}
        sx={formControlStyle}
        required={!!rules?.required}
        error={!!error?.message}
        value={value}
        label={<Box component="span">{label}</Box>}
        InputLabelProps={
          type === "date" || type === "number"
            ? {
                shrink: true
              }
            : {
                shrink: !!value
              }
        }
        type={inputType}
        helperText={<Box component="span">{inputErrorFormat(label, error?.message)}</Box>}
        variant="outlined"
        onBlur={() => {
          trigger(name, { shouldFocus: true });
          if (triggerTo) trigger(triggerTo, { shouldFocus: true });
          onBlur();
        }}
        onChange={onChange}
        placeholder={placeholder}
      />
    );
  };

  return (
    <Controller
      control={control}
      rules={rules}
      name={name}
      render={({ field, fieldState }) => {
        return render({ field, fieldState });
      }}
    />
  );
}

CustomStaffInput.defaultProps = {
  triggerTo: null,
  children: null,
  type: "text",
  placeholder: ""
};

CustomStaffInput.propTypes = {
  control: PropTypes.object.isRequired,
  rules: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  trigger: PropTypes.func.isRequired,
  triggerTo: PropTypes.string || undefined,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  children: PropTypes.node || undefined
};

export default CustomStaffInput;
