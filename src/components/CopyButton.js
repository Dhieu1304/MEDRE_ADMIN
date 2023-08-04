import PropTypes from "prop-types";
import { CopyAll as CopyAllIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

function CopyButton({ content, label }) {
  const { t } = useTranslation("components", { keyPrefix: "CopyButton" });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast(t("message.success", { content }));
    } catch (error) {
      toast(t("message.error"));
    }
  };

  if (label) {
    return (
      <Button
        endIcon={
          <CopyAllIcon
            sx={{
              cursor: "pointer"
            }}
            onClick={copyToClipboard}
          />
        }
      >
        {label}
      </Button>
    );
  }

  return (
    <CopyAllIcon
      sx={{
        cursor: "pointer"
      }}
      onClick={copyToClipboard}
    />
  );
}

CopyButton.defaultProps = {
  label: undefined
};

CopyButton.propTypes = {
  content: PropTypes.string.isRequired,
  label: PropTypes.string
};

export default CopyButton;
