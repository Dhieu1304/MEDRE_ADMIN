import PropTypes from "prop-types";
import { CopyAll as CopyAllIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function CopyButton({ content }) {
  const { t } = useTranslation("components", { keyPrefix: "CopyButton" });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast(t("message.success", { content }));
    } catch (error) {
      toast(t("message.error"));
    }
  };

  return (
    <CopyAllIcon
      sx={{
        cursor: "pointer"
      }}
      onClick={copyToClipboard}
    />
  );
}

CopyButton.propTypes = {
  content: PropTypes.string.isRequired
};

export default CopyButton;
