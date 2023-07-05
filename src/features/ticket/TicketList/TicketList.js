import React, { useEffect, useMemo, useState } from "react";

import { Box, Typography, useTheme } from "@mui/material";
import qs from "query-string";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import formatDate from "date-and-time";

import { Search as SearchIcon } from "@mui/icons-material";
import ticketServices from "../../../services/ticketServices";
import { useFetchingStore } from "../../../store/FetchingApiStore/hooks";
import { useAppConfigStore } from "../../../store/AppConfigStore/hooks";

import useObjDebounce from "../../../hooks/useObjDebounce";

import TicketFiltersForm from "./TicketFiltersForm";

import { columnsIds, createDefaultValues, initialShowCols } from "./utils";
import CustomOverlay from "../../../components/CustomOverlay/CustomOverlay";
import ListPageAction from "../../../components/ListPageAction/ListPageAction";
import ListPageTableWrapper from "../../../components/ListPageTableWrapper";
import ListPageTop from "../../../components/ListPageTop";
import CopyButton from "../../../components/CopyButton";
import { getSortValue } from "../../../utils/objectUtil";
import DataTable from "../../components/DataFilterTable/DataTable";
import { useTicketStatusesContantTranslation } from "../hooks/useTicketConstantsTranslation";
import routeConfig from "../../../config/routeConfig";
import { ticketStatuses } from "../../../entities/Ticket";

function TicketList() {
  const { locale } = useAppConfigStore();
  const [isFirst, setIsFirst] = useState(true);
  const [countRender, setCountRender] = useState(1);

  const [tickets, setTickets] = useState([]);
  const [count, setCount] = useState(0);
  const [sort, setSort] = useState({
    sortBy: columnsIds.name,
    isAsc: true
  });

  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, fetchApi } = useFetchingStore();

  // functions for multilingual use

  const [, ticketStatusListObj] = useTicketStatusesContantTranslation();

  const { t } = useTranslation("ticketFeature", { keyPrefix: "TicketList" });
  const { t: tTicket } = useTranslation("ticketEntity", { keyPrefix: "properties" });

  // state is used to represent the visibility of the Menu
  // (This menu allows the ticket to hide or show custom columns)
  const [showTableColsMenu, setShowTableColsMenu] = useState(null);

  /*
    The keys of this object represent column-by-column visibility
    We will hide address, healthInsurance for the first time
  */
  const [showCols, setShowCols] = useState({
    ...initialShowCols
  });

  const columns = useMemo(
    () => [
      {
        id: columnsIds.userName,
        label: tTicket(columnsIds.userName),
        minWidth: 100,
        render: (ticket) => ticket?.ticketOfUser?.name,
        fixed: true
      },
      {
        id: columnsIds.title,
        label: tTicket(columnsIds.title),
        minWidth: 100,
        render: (ticket) => ticket?.title
      },
      {
        id: columnsIds.createdAt,
        haveSortIcon: true,
        label: tTicket(columnsIds.createdAt),
        minWidth: 100,
        hide: !showCols[columnsIds.createdAt],
        render: (ticket) => ticket?.createdAt && formatDate.format(new Date(ticket?.createdAt), "DD/MM/YYYY")
      },
      {
        id: columnsIds.status,
        haveSortIcon: true,
        label: tTicket(columnsIds.status),
        minWidth: 100,
        hide: !showCols[columnsIds.status],
        render: (ticket) => (
          <Typography
            color={ticket?.status === ticketStatuses.CLOSE ? theme.palette.success.light : theme.palette.error.light}
          >
            {ticketStatusListObj[ticket?.status]?.label}
          </Typography>
        )
      },
      {
        id: columnsIds.action,
        label: "",
        minWidth: 100,
        render: (ticket) => {
          const ticketPath = routeConfig.support;
          return (
            <>
              <Box sx={{ ml: 1, mr: 1 }} component={Link} to={`${ticketPath}/${ticket?.id}`}>
                <SearchIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
              </Box>

              <CopyButton content={ticket?.id} />
            </>
          );
        },
        action: true
      }
    ],
    [locale, showCols, tickets]
  );

  const defaultValues = useMemo(() => {
    const defaultSearchParams = qs.parse(location.search);
    const result = createDefaultValues(defaultSearchParams);
    return result;
  }, []);

  const filterForm = useForm({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all"
  });

  const [isReset, setIsReset] = useState(false);

  const { watch, setValue, reset } = filterForm;

  const { limit, status } = watch();
  // delay 1000ms for selection and datetime
  const { debouncedObj: filterDebounce } = useObjDebounce(
    {
      limit,
      status
    },
    1000
  );

  const loadData = async ({ page }) => {
    const orderBy = sort.isAsc ? "asc" : "desc";
    let order;
    if (sort.sortBy) {
      //  { username, phoneNumber, email, name, dob, role, status }
      // console.log("columnsIds: ", columnsIds);
      const sortByFormat = getSortValue(
        columnsIds,
        {
          status: "status",
          createdAt: "createdAt"
        },
        sort.sortBy
      );

      // console.log("sortByFormat: ", sortByFormat);
      if (sortByFormat) {
        order = `${sortByFormat}:${orderBy}`;
      }
    }

    const paramsObj = {
      ...watch(),
      page,
      order
    };

    await fetchApi(
      async () => {
        const res = await ticketServices.getTickets(paramsObj);

        let countData = 0;
        let ticketsData = [];

        if (res.success) {
          ticketsData = res?.tickets || [];
          countData = res?.count;
          setTickets(ticketsData);
          setCount(countData);

          return { ...res };
        }
        setTickets([]);
        setCount(0);
        return { ...res };
      },
      { hideSuccessToast: true }
    );
  };

  useEffect(() => {
    // console.log("isReset change");

    if (isFirst) {
      setIsFirst(false);
      setCountRender((prev) => prev + 1);
    }

    let page = 1;
    if (countRender <= 2) {
      page = watch().page;
      setCountRender((prev) => prev + 1);
    }

    const params = { ...watch(), page };

    const searchParams = qs.stringify(params);
    setValue("page", page);
    navigate(`?${searchParams}`);
    loadData({ page });
  }, [...Object.values(filterDebounce), isReset, sort]);

  return (
    <Box>
      <CustomOverlay open={isLoading} />

      <ListPageTop
        title={t("title")}
        filterFormNode={
          <FormProvider {...filterForm}>
            <TicketFiltersForm />
          </FormProvider>
        }
      />

      <ListPageAction
        showCols={showCols}
        setShowCols={setShowCols}
        showTableColsMenu={showTableColsMenu}
        setShowTableColsMenu={setShowTableColsMenu}
        reset={reset}
        setIsReset={setIsReset}
        createDefaultValues={createDefaultValues}
        columns={columns}
        setValue={setValue}
        loadData={loadData}
        watch={watch}
        count={count}
      />

      <ListPageTableWrapper
        table={<DataTable rows={tickets} columns={columns} showCols={showCols} sort={sort} setSort={setSort} />}
        count={count}
        watch={watch}
        loadData={loadData}
        setValue={setValue}
      />
    </Box>
  );
}

export default TicketList;
