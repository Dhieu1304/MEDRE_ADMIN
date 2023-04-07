export const LIGHT = "light";
export const DARK = "dark";

export const getTheme = (theme) => {
  switch (theme) {
    case DARK:
      return {
        palette: {
          mode: DARK
        }
      };

    case LIGHT:
    default:
      return {
        palette: {
          mode: LIGHT,
          text: {
            disabled: "rgba(0,0,0,0.7)"
          }
        }
      };
  }
};
