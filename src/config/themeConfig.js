export const LIGHT = "LIGHT";
export const DARK = "DARK";

export const getTheme = (theme) => {
  switch (theme) {
    case DARK:
      return {
        palette: {
          mode: "dark"
        }
      };

    case LIGHT:
    default:
      return {
        palette: {
          mode: "light"
        }
      };
  }
};
