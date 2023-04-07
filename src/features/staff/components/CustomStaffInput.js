import { faEdit as faEditIcon, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

import {
  Box,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import { Children, cloneElement, isValidElement, useState } from "react";
import { Controller } from "react-hook-form";
import { inputErrorFormat } from "../../../utils/stringFormat";

function CustomStaffInput({
  control,
  rules = {},
  label,
  trigger,
  triggerTo,
  name,
  type = "text",
  placeholder,
  disabled,
  children,
  InputProps: CustomInputProps,
  multiline,
  rows,
  message,
  showCanEditIcon
}) {
  const theme = useTheme();

  const [hidePassword, setHidePassword] = useState(true);

  const formControlStyle = {
    margin: 0,
    padding: 0
  };

  const labelShinkFontSize = 20;

  const renderLabel = () => (
    <Box
      sx={{
        fontSize: labelShinkFontSize
      }}
      component="span"
    >
      {label}
      {showCanEditIcon && !disabled && (
        <Box
          component={FontAwesomeIcon}
          size="1x"
          icon={faEditIcon}
          cursor="pointer"
          color={theme.palette.success.light}
          sx={{
            ml: 1
          }}
        />
      )}
    </Box>
  );

  const InputLabelPropsSx = {
    "&.MuiInputLabel-outlined.MuiInputLabel-shrink span": {
      "&:first-of-type": {
        fontSize: labelShinkFontSize,
        fontWeight: "600",
        color: "rgba(0,0,0,0.8)"
      }
    },
    "&.MuiInputLabel-outlined:not(.MuiInputLabel-shrink) span": {
      "&:first-of-type": {
        fontSize: 16,
        fontWeight: "400",
        color: "rgba(0,0,0,0.5)"
      }
    },
    "& .MuiInputLabel-asterisk": {
      color: "red",
      fontSize: 25
    },
    "& .MuiOutlinedInput-notchedOutline legend": {
      fontSize: 20,
      fontWeight: "600",
      color: "yellow"
    }
  };
  const render = ({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
    let inputType = type;
    if (type === "password") {
      inputType = hidePassword ? "password" : "text";
    }

    if (children) {
      // const shrink = Array.isArray(value) ? (value.length > 0 ? true : false) : !!value;
      // Đừng dùng cái này => ko sẽ có lỗi

      return (
        <FormControl sx={formControlStyle} variant="outlined" fullWidth>
          <InputLabel
            variant="outlined"
            required={!!rules?.required}
            // shrink={shrink} // Đừng dùng cái này => ko sẽ có lỗi
            sx={{
              ...InputLabelPropsSx
            }}
          >
            {renderLabel()}
          </InputLabel>

          {/* add props for children
           https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children
           */}

          {Children.map(children, (child) => {
            if (isValidElement(child)) {
              return cloneElement(child, {
                label: renderLabel(),
                error: !!error,
                value,
                onBlur: () => {
                  trigger(name, { shouldFocus: true });
                  onBlur();
                },
                onChange,
                placeholder,
                disabled
              });
            }
            return child;
          })}

          <FormHelperText>
            <Box component="span">{inputErrorFormat(label, error?.message)}</Box>
          </FormHelperText>
          {!error?.message && message && message?.text && (
            <Typography
              variant="body"
              color={theme.palette[message?.type].light}
              sx={{
                ml: 2
              }}
            >
              {message?.text}
            </Typography>
          )}
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
        : CustomInputProps || {};

    return (
      <>
        <Box
          component={TextField}
          label={renderLabel()}
          InputLabelProps={{
            shrink: type === "date" || type === "number" ? true : !!value,
            sx: { ...InputLabelPropsSx }
          }}
          variant="outlined"
          fullWidth
          InputProps={InputProps}
          required={!!rules?.required}
          error={!!error?.message}
          value={value}
          // label={label}
          disabled={disabled}
          type={inputType}
          helperText={<Box component="span">{inputErrorFormat(label, error?.message)}</Box>}
          onBlur={() => {
            trigger(name, { shouldFocus: true });
            if (triggerTo) trigger(triggerTo, { shouldFocus: true });
            onBlur();
          }}
          onChange={onChange}
          placeholder={placeholder}
          multiline={multiline}
          rows={rows}
        />
        {!error?.message && message && message?.text && (
          <Typography
            variant="body"
            color={theme.palette[message?.type].light}
            sx={{
              ml: 2
            }}
          >
            {message?.text}
          </Typography>
        )}
      </>
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
  rules: {},
  triggerTo: null,
  children: null,
  type: "text",
  placeholder: "",
  disabled: undefined,
  InputProps: undefined,
  message: undefined,
  showCanEditIcon: undefined,
  multiline: undefined,
  rows: undefined
};

CustomStaffInput.propTypes = {
  control: PropTypes.object.isRequired,
  rules: PropTypes.object,
  label: PropTypes.string.isRequired,
  trigger: PropTypes.func.isRequired,
  triggerTo: PropTypes.oneOfType([PropTypes.string]),

  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node]),
  disabled: PropTypes.oneOfType([PropTypes.bool]),
  InputProps: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  message: PropTypes.shape({
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["success", "error"]).isRequired
  }),
  showCanEditIcon: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number
};

export default CustomStaffInput;
