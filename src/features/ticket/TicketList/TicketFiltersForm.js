import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { useTicketFilterTranslation } from "./hooks";
import DataFilter, { inputComponentTypes } from "../../components/DataFilterTable/DataFilter";

function TicketFiltersForm() {
  const { locale } = useAppConfigStore();

  const { t: tFilter } = useTranslation("ticketFeature", { keyPrefix: "TicketList.filter" });

  const filterForm = useFormContext();

  const { ticketStatusList, ticketStatusListObj } = useTicketFilterTranslation();

  const inputs = useMemo(() => {
    return [
      {
        label: tFilter("status"),
        name: "status",
        inputComponentType: inputComponentTypes.SELECT,
        list: ticketStatusList,
        listObj: ticketStatusListObj
      }
    ];
  }, [locale]);

  return <DataFilter inputs={inputs} filterForm={filterForm} />;
}

export default TicketFiltersForm;
