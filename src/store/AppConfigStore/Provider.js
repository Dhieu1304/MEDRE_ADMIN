import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { LIGHT } from "../../config/themeConfig";
import Context from "./Context";

function AppConfigProvider({ children }) {
  const [mode, setMode] = useState(LIGHT);

  const localeCodeObj = useMemo(() => {
    return {
      vi: "viVN",
      en: "enUS"
    };
  }, []);

  const currentLocaleCode = localStorage.getItem("i18nextLng") || "en";

  const [locale, setLocale] = useState(localeCodeObj[currentLocaleCode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      locale,
      setLocale
    }),
    [mode, locale]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

AppConfigProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AppConfigProvider;
