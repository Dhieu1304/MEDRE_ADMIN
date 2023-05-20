// import React, { useEffect, useMemo, useState } from "react";

// import { Box } from "@mui/material";
// import qs from "query-string";
// import { FormProvider, useForm } from "react-hook-form";
// import { useTranslation } from "react-i18next";
// import { useLocation, useNavigate } from "react-router-dom";

// import settingServices from "../../../services/settingServices";
// import { useFetchingStore } from "../../../store/FetchingApiStore/hooks";
// import { useAppConfigStore } from "../../../store/AppConfigStore/hooks";
// import { useCustomModal } from "../../../components/CustomModal/hooks";

// import { NotHaveAccessModal } from "../../auth";

// import useObjDebounce from "../../../hooks/useObjDebounce";

// import SettingFiltersForm from "./SettingFiltersForm";
// import SettingTable from "./SettingTable";

// import { columnsIds, createDefaultValues, initialShowCols } from "./utils";
// import { BlockSettingModal, UnblockSettingModal } from "../components";
// import CustomOverlay from "../../../components/CustomOverlay/CustomOverlay";
// import ListPageAction from "../../../components/ListPageAction/ListPageAction";
// import ListPageTableWrapper from "../../../components/ListPageTableWrapper";
// import ListPageTop from "../../../components/ListPageTop";

// function SettingList() {
//   const { locale } = useAppConfigStore();
//   const [isFirst, setIsFirst] = useState(true);
//   const [countRender, setCountRender] = useState(1);

//   const [settings, setSettings] = useState([]);
//   const [count, setCount] = useState(0);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const { isLoading, fetchApi } = useFetchingStore();

//   const notHaveAccessModal = useCustomModal();
//   const blockSettingModal = useCustomModal();
//   const unblockSettingModal = useCustomModal();

//   // functions for multilingual use

//   const { t } = useTranslation("settingFeature", { keyPrefix: "SettingList" });
//   const { t: tSetting } = useTranslation("settingEntity", { keyPrefix: "properties" });

//   // state is used to represent the visibility of the Menu
//   // (This menu allows the setting to hide or show custom columns)
//   const [showTableColsMenu, setShowTableColsMenu] = useState(null);

//   /*
//     The keys of this object represent column-by-column visibility
//     We will hide address, healthInsurance for the first time
//   */
//   const [showCols, setShowCols] = useState({
//     ...initialShowCols,
//     [columnsIds.healthInsurance]: false,
//     [columnsIds.address]: false
//   });

//   const columns = useMemo(
//     () => [
//       {
//         id: columnsIds.name,
//         label: tSetting(columnsIds.name),
//         minWidth: 100
//       },
//       {
//         id: columnsIds.phoneNumber,
//         label: tSetting(columnsIds.phoneNumber),
//         minWidth: 100,
//         hide: !showCols[columnsIds.phoneNumber]
//       },
//       {
//         id: columnsIds.email,
//         label: tSetting(columnsIds.email),
//         minWidth: 100,
//         hide: !showCols[columnsIds.email]
//       },
//       {
//         id: columnsIds.address,
//         label: tSetting(columnsIds.address),
//         minWidth: 100,
//         hide: !showCols[columnsIds.address]
//       },
//       {
//         id: columnsIds.gender,
//         label: tSetting(columnsIds.gender),
//         minWidth: 100,
//         hide: !showCols[columnsIds.gender]
//       },
//       {
//         id: columnsIds.dob,
//         label: tSetting(columnsIds.dob),
//         minWidth: 100,
//         hide: !showCols[columnsIds.dob]
//       },
//       {
//         id: columnsIds.healthInsurance,
//         label: tSetting(columnsIds.healthInsurance),
//         minWidth: 200,
//         hide: !showCols[columnsIds.healthInsurance]
//       },
//       {
//         id: columnsIds.status,
//         label: tSetting(columnsIds.status),
//         minWidth: 200,
//         hide: !showCols[columnsIds.status]
//       },
//       {
//         id: columnsIds.action,
//         label: "",
//         minWidth: 100
//       }
//     ],
//     [locale, showCols]
//   );

//   const defaultValues = useMemo(() => {
//     const defaultSearchParams = qs.parse(location.search);
//     const result = createDefaultValues(defaultSearchParams);
//     return result;
//   }, []);

//   const filterForm = useForm({
//     mode: "onChange",
//     defaultValues,
//     criteriaMode: "all"
//   });

//   const [isReset, setIsReset] = useState(false);

//   const { watch, setValue, reset } = filterForm;

//   const { email, phoneNumber, name, address, healthInsurance } = watch();
//   // delay 1000ms for search string
//   const { debouncedObj: searchDebounce } = useObjDebounce(
//     {
//       email,
//       phoneNumber,
//       name,
//       address,
//       healthInsurance
//     },
//     1000
//   );

//   const { limit, status, gender } = watch();
//   // delay 1000ms for selection and datetime
//   const { debouncedObj: filterDebounce } = useObjDebounce(
//     {
//       limit,
//       status,
//       gender
//     },
//     1000
//   );

//   const loadData = async ({ page }) => {
//     const paramsObj = {
//       ...watch(),
//       blocked: watch().status,
//       page
//     };

//     await fetchApi(async () => {
//       const res = await settingServices.getSettingList(paramsObj);

//       let countData = 0;
//       let settingsData = [];

//       if (res.success) {
//         settingsData = res?.settings || [];
//         countData = res?.count;
//         setSettings(settingsData);
//         setCount(countData);

//         return { success: true };
//       }
//       setSettings([]);
//       setCount(0);
//       return { error: res.message };
//     });
//   };

//   useEffect(() => {
//     // console.log("isReset change");

//     if (isFirst) {
//       setIsFirst(false);
//       setCountRender((prev) => prev + 1);
//     }

//     let page = 1;
//     if (countRender <= 2) {
//       page = watch().page;
//       setCountRender((prev) => prev + 1);
//     }

//     const params = { ...watch(), page };

//     const searchParams = qs.stringify(params);
//     setValue("page", page);
//     navigate(`?${searchParams}`);
//     loadData({ page });
//   }, [...Object.values(filterDebounce), ...Object.values(searchDebounce), isReset]);

//   const handleAfterBlockSetting = async () => {
//     await loadData({ page: watch().page });
//   };

//   const handleAfterUnblockSetting = async () => {
//     await loadData({ page: watch().page });
//   };

//   return (
//     <>
//       <Box>
//         <CustomOverlay open={isLoading} />

//         <ListPageTop
//           title={t("title")}
//           filterFormNode={
//             <FormProvider {...filterForm}>
//               <SettingFiltersForm />
//             </FormProvider>
//           }
//         />

//         <ListPageAction
//           showCols={showCols}
//           setShowCols={setShowCols}
//           showTableColsMenu={showTableColsMenu}
//           setShowTableColsMenu={setShowTableColsMenu}
//           reset={reset}
//           setIsReset={setIsReset}
//           createDefaultValues={createDefaultValues}
//           columns={columns}
//           setValue={setValue}
//           loadData={loadData}
//           watch={watch}
//           count={count}
//         />

//         <ListPageTableWrapper
//           table={
//             <SettingTable
//               settings={settings}
//               notHaveAccessModal={notHaveAccessModal}
//               blockSettingModal={blockSettingModal}
//               unblockSettingModal={unblockSettingModal}
//               columns={columns}
//               showCols={showCols}
//             />
//           }
//           count={count}
//           watch={watch}
//           loadData={loadData}
//           setValue={setValue}
//         />
//       </Box>

//       {blockSettingModal.show && (
//         <BlockSettingModal
//           show={blockSettingModal.show}
//           setShow={blockSettingModal.setShow}
//           data={blockSettingModal.data}
//           setData={blockSettingModal.setData}
//           handleAfterBlockSetting={handleAfterBlockSetting}
//         />
//       )}

//       {unblockSettingModal.show && (
//         <UnblockSettingModal
//           show={unblockSettingModal.show}
//           setShow={unblockSettingModal.setShow}
//           data={unblockSettingModal.data}
//           setData={unblockSettingModal.setData}
//           handleAfterUnblockSetting={handleAfterUnblockSetting}
//         />
//       )}

//       {notHaveAccessModal.show && <NotHaveAccessModal show={notHaveAccessModal.show} setShow={notHaveAccessModal.setShow} />}
//     </>
//   );
// }

// export default SettingList;

const SettingList = () => {
  return <div>SettingList</div>;
};

export default SettingList;
