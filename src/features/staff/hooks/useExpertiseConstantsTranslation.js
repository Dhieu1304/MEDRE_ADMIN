import { useMemo } from "react";

export const useExpertisesContantTranslation = (expertisesList) => {
  const expertiseListObj = useMemo(() => {
    return expertisesList?.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.id]: cur
      };
    }, {});
  }, [expertisesList]);

  return expertiseListObj;
};
