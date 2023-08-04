import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { ticketStatuses } from "../../../entities/Ticket";

export const useTicketStatusesContantTranslation = () => {
  const { locale } = useAppConfigStore();

  const { t: tStatuses } = useTranslation("ticketEntity", { keyPrefix: "constants.statuses" });

  const [ticketStatusList, ticketStatusListObj] = useMemo(() => {
    const list = [
      {
        label: tStatuses("open"),
        value: ticketStatuses.OPEN
      },
      {
        label: tStatuses("close"),
        value: ticketStatuses.CLOSE
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

  return [ticketStatusList, ticketStatusListObj];
};
