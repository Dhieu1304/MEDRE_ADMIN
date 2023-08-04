import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { ticketStatuses } from "../../../entities/Ticket";

export const useTicketFilterTranslation = () => {
  const { locale } = useAppConfigStore();

  const { t: tSelect } = useTranslation("ticketFeature", { keyPrefix: "TicketList.select" });

  const [ticketStatusList, ticketStatusListObj] = useMemo(() => {
    const list = [
      {
        label: tSelect("statuses.open"),
        value: ticketStatuses.OPEN
      },
      {
        label: tSelect("statuses.close"),
        value: ticketStatuses.CLOSE
      },
      {
        label: tSelect("statuses.all"),
        value: ""
      }
    ];

    const listObj = list.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});

    return [list, listObj];
  }, [locale]);

  return {
    ticketStatusList,
    ticketStatusListObj
  };
};
