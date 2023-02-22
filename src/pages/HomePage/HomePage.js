import { TablePagination } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../store/AppConfigStore/hooks";
import "../../config/i18n";

function HomePage() {
  const { mode, locale } = useAppConfigStore();

  const { t } = useTranslation();

  return (
    <div>
      <p>mode: {mode}</p>
      <p>locale: {locale}</p>

      <div>
        <p>{t("title")}</p>
        <p>{t("description.part1")}</p>
        <p>{t("description.part2")}</p>
      </div>
      <TablePagination count={2000} rowsPerPage={10} page={1} component="div" onPageChange={() => {}} />
    </div>
  );
}

export default HomePage;
