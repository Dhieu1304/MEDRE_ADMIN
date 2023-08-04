import React, { useEffect, useMemo, useState } from "react";

import { Box, Button, Paper, Table, TableBody, TableContainer, TableHead, TableRow, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";

import expertiseServices from "../../services/expertiseServices";
import { useFetchingStore } from "../../store/FetchingApiStore/hooks";
import { useAppConfigStore } from "../../store/AppConfigStore/hooks";

import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import CustomPageTitle from "../../components/CustomPageTitle";
import CustomTableCell, { customTableCellVariant } from "../../components/CustomTable/CustomTableCell";
import { useCustomModal } from "../../components/CustomModal";
import ChangeExpertiseModal from "./components/ChangeExpertiseModal";
import AddExpertiseModal from "./components/AddExpertiseModal";
import { formatCurrency } from "../../utils/stringFormat";
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
  const addExpertiseModal = useCustomModal();

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
        minWidth: 60
      },
      {
        id: "onlinePrice",
        label: tExpertise("onlinePrice"),
        minWidth: 60
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
    await fetchApi(
      async () => {
        const res = await expertiseServices.getExpertiseList();

        if (res.success) {
          const expertisesData = res?.expertises || [];
          setExpertises(expertisesData);

          return { ...res };
        }
        setExpertises([]);
        return { ...res };
      },
      { hideSuccessToast: true }
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAfterEditExpertise = async () => {
    await loadData();
  };

  const handleAfterAddExpertise = async () => {
    await loadData();
  };

  return (
    <>
      <CustomOverlay open={isLoading} />
      <Box>
        <CustomPageTitle
          title={t("title")}
          right={
            <Button
              variant="contained"
              onClick={() => {
                addExpertiseModal.setShow(true);
              }}
              endIcon={<AddIcon fontSize="large" />}
              sx={{
                bgcolor: theme.palette.success.light
              }}
            >
              {t("button.add")}
            </Button>
          }
        />
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
                    <CustomTableCell>{formatCurrency(expertise?.priceOffline)}</CustomTableCell>
                    <CustomTableCell>{formatCurrency(expertise?.priceOnline)}</CustomTableCell>
                    <CustomTableCell variant={customTableCellVariant.ACTION_BODY_CELL}>
                      <EditIcon
                        sx={{
                          cursor: "pointer",
                          color: theme.palette.success.light
                        }}
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

      {addExpertiseModal.show && (
        <AddExpertiseModal
          show={addExpertiseModal.show}
          setShow={addExpertiseModal.setShow}
          handleAfterAddExpertise={handleAfterAddExpertise}
        />
      )}
    </>
  );
}
export default ExpertiseList;
