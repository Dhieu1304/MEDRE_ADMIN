import React, { useEffect, useMemo, useState } from "react";

import { Box, Button, Paper, Table, TableBody, TableContainer, TableHead, TableRow, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Edit as EditIcon } from "@mui/icons-material";

import settingServices from "../../services/settingServices";
import { useFetchingStore } from "../../store/FetchingApiStore/hooks";
import { useAppConfigStore } from "../../store/AppConfigStore/hooks";

import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import CustomPageTitle from "../../components/CustomPageTitle";
import CustomTableCell, { customTableCellVariant } from "../../components/CustomTable/CustomTableCell";
import { useCustomModal } from "../../components/CustomModal";
import ChangeSettingModal from "./components/ChangeSettingModal";
import { Can } from "../../store/AbilityStore";
import { settingActionAbility } from "../../entities/Setting";
import entities from "../../entities/entities";

function SettingList() {
  const [settings, setSettings] = useState([]);

  const { locale } = useAppConfigStore();
  const { isLoading, fetchApi } = useFetchingStore();
  const theme = useTheme();

  const { t } = useTranslation("settingFeature", { keyPrefix: "SettingList" });
  const { t: tSetting } = useTranslation("settingEntity", { keyPrefix: "properties" });
  const { t: tSettingNames } = useTranslation("settingEntity", { keyPrefix: "constants.names" });
  const { t: tSettingUnits } = useTranslation("settingEntity", { keyPrefix: "constants.units" });

  const changeSettingModal = useCustomModal();

  const columns = useMemo(
    () => [
      {
        id: "descName",
        label: tSetting("descName"),
        minWidth: 100
      },
      {
        id: "value",
        label: tSetting("value"),
        minWidth: 20
      }
    ],
    [locale]
  );

  const settingLabelObj = useMemo(() => {
    return {
      maintain: {
        label: tSettingNames("maintain"),
        unit: tSettingUnits("maintain")
      },
      bookAdvanceDay: {
        label: tSettingNames("bookAdvanceDay"),
        unit: tSettingUnits("bookAdvanceDay")
      },
      bookAfterDay: {
        label: tSettingNames("bookAfterDay"),
        unit: tSettingUnits("bookAfterDay")
      },
      createScheduleAdvanceDay: {
        label: tSettingNames("createScheduleAdvanceDay"),
        unit: tSettingUnits("createScheduleAdvanceDay")
      },
      cancelOnlineBookingAfterMinute: {
        label: tSettingNames("cancelOnlineBookingAfterMinute"),
        unit: tSettingUnits("cancelOnlineBookingAfterMinute")
      }
    };
  }, [locale]);

  const loadData = async () => {
    await fetchApi(async () => {
      const res = await settingServices.getSettingList();

      if (res.success) {
        const settingsData = res?.settings || [];
        setSettings(settingsData);

        return { ...res };
      }
      setSettings([]);
      return { ...res };
    });
  };

  // console.log("settings ", settings);

  useEffect(() => {
    loadData();
  }, []);

  const handleAfterEditSetting = async () => {
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
              {settings?.map((setting) => {
                return (
                  <TableRow key={setting?.id}>
                    <CustomTableCell>{settingLabelObj[setting?.name]?.label}</CustomTableCell>
                    <CustomTableCell align="left">
                      <Can I={settingActionAbility.UPDATE} a={entities.SETTING}>
                        <Button
                          onClick={() => {
                            changeSettingModal.setShow(true);
                            changeSettingModal.setData(setting);
                          }}
                          endIcon={<EditIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />}
                        >
                          {setting?.value}
                        </Button>
                      </Can>
                      <Can not I={settingActionAbility.UPDATE} a={entities.SETTING}>
                        {setting?.value}
                      </Can>
                    </CustomTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {changeSettingModal.show && (
        <ChangeSettingModal
          show={changeSettingModal.show}
          setShow={changeSettingModal.setShow}
          data={changeSettingModal.data}
          setData={changeSettingModal.setData}
          handleAfterEditSetting={handleAfterEditSetting}
        />
      )}
    </>
  );
}
export default SettingList;
