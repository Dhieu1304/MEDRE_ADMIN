import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { Box, FormHelperText, useTheme } from "@mui/material";
import { inputErrorFormat } from "../../utils/stringFormat";

function CustomHtmlInput({ label, control, name, rules, sx, disabled }) {
  const theme = useTheme();
  return (
    <Controller
      control={control}
      rules={rules}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const errorStyles = error ? { border: "1px solid red", overflowY: "hidden" } : {};
        return (
          <>
            <Box sx={{ mb: 2, height: 500, ...sx }}>
              <Box
                component={ReactQuill}
                sx={{
                  height: "100%",
                  borderRadius: "2px",
                  ...errorStyles
                }}
                readOnly={disabled}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                    ["link", "image"],
                    ["clean"],
                    [{ color: [] }] // Màu chữ và nền
                  ]
                }}
                formats={[
                  "header",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "blockquote",
                  "list",
                  "bullet",
                  "indent",
                  "link",
                  "image",
                  "color"
                ]}
              />
            </Box>
            {error?.message && (
              <FormHelperText>
                <Box
                  component="span"
                  sx={{
                    color: theme.palette.error.light
                  }}
                >
                  {inputErrorFormat(label, error?.message)}
                </Box>
              </FormHelperText>
            )}
          </>
        );
      }}
    />
  );
}

CustomHtmlInput.defaultProps = {
  rules: {},
  sx: {},
  disabled: false
};

CustomHtmlInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  sx: PropTypes.object,
  control: PropTypes.object.isRequired,
  rules: PropTypes.object,
  disabled: PropTypes.bool
};

export default CustomHtmlInput;
