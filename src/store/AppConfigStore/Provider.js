import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { LIGHT } from "../../config/themeConfig";
import Context from "./Context";

function AppConfigProvider({ children }) {
  const [mode, setMode] = useState(LIGHT);
  const [locale, setLocale] = useState("viVN");

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
