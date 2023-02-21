import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

import { Box, FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { inputErrorFormat } from "../../../utils/stringFormat";

const AuthInput = ({
  control,
  rules = {},
  label,
  trigger,
  triggerTo,
  name,
  type = "text",
  componentType = "text",
  selectItems = []
}) => {
  const [hidePassword, setHidePassword] = useState(true);

  const render = () => {
    switch (componentType) {
      case "select":
        return (
          <Controller
            control={control}
            rules={rules}
            name={name}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
              return (
                <FormControl sx={{ mb: 2 }} fullWidth variant="outlined">
                  <InputLabel variant="outlined">
                    <Box component="span">{label}</Box>
                  </InputLabel>
                  <Select
                    label={label}
                    required={!!rules?.required}
                    error={!!error}
                    value={value}
                    onBlur={() => {
                      trigger(name, { shouldFocus: true });
                      onBlur();
                    }}
                    onChange={onChange}
                  >
                    {selectItems.map((item) => {
                      return (
                        <MenuItem key={item?.value} value={item?.value}>
                          {item?.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>
                    <Box component="span">{inputErrorFormat(label, error?.message)}</Box>
                  </FormHelperText>
                </FormControl>
              );
            }}
          />
        );
      case "text":
      default:
        return (
          <Controller
            control={control}
            rules={rules}
            name={name}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
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

              let inputType = type;
              if (type === "password") {
                inputType = hidePassword ? "password" : "text";
              }

              return (
                <Box
                  component={TextField}
                  InputProps={InputProps}
                  sx={{ mb: 2 }}
                  required={!!rules?.required}
                  error={!!error?.message}
                  value={value}
                  label={<Box component="span">{label}</Box>}
                  type={inputType}
                  fullWidth
                  helperText={<Box component="span">{inputErrorFormat(label, error?.message)}</Box>}
                  variant="outlined"
                  onBlur={() => {
                    trigger(name, { shouldFocus: true });
                    if (triggerTo) trigger(triggerTo, { shouldFocus: true });
                    onBlur();
                  }}
                  onChange={onChange}
                />
              );
            }}
          />
        );
    }
  };

  return render();
};

AuthInput.prototype = {
  control: PropTypes.string,
  rules: PropTypes.object,
  label: PropTypes.string,
  trigger: PropTypes.func,
  triggerTo: PropTypes.string || undefined,
  name: PropTypes.string,
  type: PropTypes.string,
  componentType: PropTypes.string,
  selectItems: PropTypes.array
};

export default AuthInput;
