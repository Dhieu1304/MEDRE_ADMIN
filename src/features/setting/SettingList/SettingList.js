import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  useTheme
} from "@mui/material";
import formatDate from "date-and-time";
import { useTranslation } from "react-i18next";
import { Edit as EditIcon } from "@mui/icons-material";

import settingServices from "../../../services/settingServices";
import { useFetchingStore } from "../../../store/FetchingApiStore/hooks";
import { useAppConfigStore } from "../../../store/AppConfigStore/hooks";
// import { useCustomModal } from "../../../components/CustomModal/hooks";

import CustomOverlay from "../../../components/CustomOverlay/CustomOverlay";
import CustomPageTitle from "../../../components/CustomPageTitle";
import CustomTableCell, { customTableCellVariant } from "../../../components/CustomTable/CustomTableCell";

function SettingList() {
  const [settings, setSettings] = useState([]);

  const { locale } = useAppConfigStore();
  const { isLoading, fetchApi } = useFetchingStore();
  const theme = useTheme();

  const { t } = useTranslation("settingFeature", { keyPrefix: "SettingList" });
  const { t: tSetting } = useTranslation("settingEntity", { keyPrefix: "properties" });

  const columns = useMemo(
    () => [
      {
        id: "descName",
        label: tSetting("descName"),
        minWidth: 100
      },
      {
        id: "createdAt",
        label: tSetting("createdAt"),
        minWidth: 50
      },
      {
        id: "updatedAt",
        label: tSetting("updatedAt"),
        minWidth: 50
      },
      {
        id: "value",
        label: tSetting("value"),
        minWidth: 20
      }
    ],
    [locale]
  );

  const loadData = async () => {
    await fetchApi(async () => {
      const res = await settingServices.getSettingList();

      if (res.success) {
        const settingsData = res?.settings || [];
        setSettings(settingsData);

        return { success: true };
      }
      setSettings([]);
      return { error: res.message };
    });
  };

  useEffect(() => {
    loadData();
  }, []);

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
                      align={align}
                      sx={{ minWidth }}
                      key={column?.id}
                      variant={customTableCellVariant.HEAD_CELL}
                    >
                      {column.label}
                    </CustomTableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {settings?.map((setting) => {
                return (
                  <TableRow>
                    <CustomTableCell>{setting?.descName}</CustomTableCell>
                    <CustomTableCell>{formatDate.format(new Date(setting?.createdAt), "DD/MM/YYYY")}</CustomTableCell>
                    <CustomTableCell>{formatDate.format(new Date(setting?.updatedAt), "DD/MM/YYYY")}</CustomTableCell>
                    <CustomTableCell align="center">
                      <Button
                        onClick={() => {}}
                        endIcon={<EditIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />}
                      >
                        {setting?.value}
                      </Button>
                    </CustomTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
export default SettingList;
