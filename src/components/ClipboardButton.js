import PropTypes from "prop-types";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function ClipboardButton({ setValue }) {
  const { t } = useTranslation("components", { keyPrefix: "ClipboardButton" });
  const handlePasteFromClipboard = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        setValue(text); // Gọi hàm setValue để cập nhật giá trị
        toast(t("message.success", { content: text }));
      })
      .catch(() => {
        toast(t("message.error"));
      });
  };

  return (
    <ContentPasteIcon
      sx={{
        cursor: "pointer"
      }}
      onClick={handlePasteFromClipboard}
    />
  );
}

ClipboardButton.propTypes = {
  setValue: PropTypes.func.isRequired
};

export default ClipboardButton;
