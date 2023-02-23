import vi from "./vi/translation.json";
import en from "./en/translation.json";

const translations = {
  vi,
  en
};

const locales = Object.keys(translations).reduce(
  (result, key) => ({
    ...result,
    [key]: {
      translation: translations[key]
    }
  }),
  {}
);

export default locales;
