import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { LIGHT } from "../../config/themeConfig";
import Context from "./Context";
import localStorageUtil from "../../utils/localStorageUtil";

function AppConfigProvider({ children }) {
  const [mode, setMode] = useState(LIGHT);

  const currentLocale = localStorageUtil.getItem(localStorageUtil.LOCAL_STORAGE.LOCALE || "viVN");
  const [locale, setLocale] = useState(currentLocale);

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
