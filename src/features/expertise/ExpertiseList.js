import React, { useEffect, useMemo, useState } from "react";

import { Box, Paper, Table, TableBody, TableContainer, TableHead, TableRow, useTheme } from "@mui/material";
import formatDate from "date-and-time";
import { useTranslation } from "react-i18next";
import { Edit as EditIcon } from "@mui/icons-material";

import expertiseServices from "../../services/expertiseServices";
import { useFetchingStore } from "../../store/FetchingApiStore/hooks";
import { useAppConfigStore } from "../../store/AppConfigStore/hooks";

import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import CustomPageTitle from "../../components/CustomPageTitle";
import CustomTableCell, { customTableCellVariant } from "../../components/CustomTable/CustomTableCell";
import { useCustomModal } from "../../components/CustomModal";
import ChangeExpertiseModal from "./components/ChangeExpertiseModal";
// import { Can } from "../../store/AbilityStore";
// import Expertise from "../../entities/Expertise/Expertise";
// import { expertiseActionAbility } from "../../entities/Expertise";

function ExpertiseList() {
  const [expertises, setExpertises] = useState([]);

  const { locale } = useAppConfigStore();
  const { isLoading, fetchApi } = useFetchingStore();
  const theme = useTheme();

  const { t } = useTranslation("expertiseFeature", { keyPrefix: "ExpertiseList" });
  const { t: tExpertise } = useTranslation("expertiseEntity", { keyPrefix: "properties" });
  const changeExpertiseModal = useCustomModal();

  const columns = useMemo(
    () => [
      {
        id: "name",
        label: tExpertise("name"),
        minWidth: 100
      },
      {
        id: "offlinePrice",
        label: tExpertise("offlinePrice"),
        minWidth: 100
      },
      {
        id: "onlinePrice",
        label: tExpertise("onlinePrice"),
        minWidth: 100
      },
      {
        id: "createdAt",
        label: tExpertise("createdAt"),
        minWidth: 50
      },
      {
        id: "updatedAt",
        label: tExpertise("updatedAt"),
        minWidth: 50
      },
      {
        id: "action",
        label: "",
        minWidth: 20
      }
    ],
    [locale]
  );

  const loadData = async () => {
    await fetchApi(async () => {
      const res = await expertiseServices.getExpertiseList();

      if (res.success) {
        const expertisesData = res?.expertises || [];
        setExpertises(expertisesData);

        return { ...res };
      }
      setExpertises([]);
      return { ...res };
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAfterEditExpertise = async () => {
    await loadData();
  };

  return (
    <>
      <CustomOverlay open={isLoading} />
      <Box>
        <CustomPageTitle title={t("title")} />
        <TableContainer component={Paper} sx={{ mb: 4, height: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns?.map((column) => {
                  const minWidth = column?.minWidth;
                  const align = column.id === "value" ? "center" : undefined;
                  return (
                    <CustomTableCell
                      key={column?.id}
                      align={align}
                      sx={{ minWidth }}
                      variant={customTableCellVariant.HEAD_CELL}
                    >
                      {column.label}
                    </CustomTableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {expertises?.map((expertise) => {
                return (
                  <TableRow key={expertise?.id}>
                    <CustomTableCell>{expertise?.name}</CustomTableCell>
                    <CustomTableCell>{expertise?.priceOffline}</CustomTableCell>
                    <CustomTableCell>{expertise?.priceOnline}</CustomTableCell>
                    <CustomTableCell>{formatDate.format(new Date(expertise?.createdAt), "DD/MM/YYYY")}</CustomTableCell>
                    <CustomTableCell>{formatDate.format(new Date(expertise?.updatedAt), "DD/MM/YYYY")}</CustomTableCell>
                    <CustomTableCell variant={customTableCellVariant.ACTION_BODY_CELL}>
                      <EditIcon
                        color={theme.palette.success.light}
                        onClick={() => {
                          changeExpertiseModal.setShow(true);
                          changeExpertiseModal.setData({ ...expertise });
                        }}
                      />
                    </CustomTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {changeExpertiseModal.show && (
        <ChangeExpertiseModal
          show={changeExpertiseModal.show}
          setShow={changeExpertiseModal.setShow}
          data={changeExpertiseModal.data}
          setData={changeExpertiseModal.setData}
          handleAfterEditExpertise={handleAfterEditExpertise}
        />
      )}
    </>
  );
}
export default ExpertiseList;
