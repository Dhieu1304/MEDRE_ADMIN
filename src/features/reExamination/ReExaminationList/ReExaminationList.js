// import { useEffect, useState } from "react";
// import reExaminationServices from "../../../services/reExaminationServices";
// import { useAppConfigStore } from "../../../store/AppConfigStore";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useFetchingStore } from "../../../store/FetchingApiStore";
// import ListPageTableWrapper from "../../../components/ListPageTableWrapper";
// import ListPageAction from "../../../components/ListPageAction/ListPageAction";
// import ListPageTop from "../../../components/ListPageTop";

// function ReExaminationList() {
//   const { locale } = useAppConfigStore();
//   const [isFirst, setIsFirst] = useState(true);
//   const [countRender, setCountRender] = useState(1);

//   const [patients, setPatients] = useState([]);
//   const [count, setCount] = useState(0);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const { isLoading, fetchApi } = useFetchingStore();

//   useEffect(() => {
//     const loadData = async () => {
//       const res = await reExaminationServices.getBookingList();
//       console.log("res: ", res);
//     };

//     loadData();
//   }, []);

//   return (
//     <Box>
//       <CustomOverlay open={isLoading} />

//       <ListPageTop
//         title={t("title")}
//         // filterFormNode={
//         //   <FormProvider {...filterForm}>
//         //     <PatientFiltersForm />
//         //   </FormProvider>
//         // }
//       />

//       {/* <ListPageAction
//         showCols={showCols}
//         setShowCols={setShowCols}
//         showTableColsMenu={showTableColsMenu}
//         setShowTableColsMenu={setShowTableColsMenu}
//         reset={reset}
//         setIsReset={setIsReset}
//         createDefaultValues={createDefaultValues}
//         columns={columns}
//         setValue={setValue}
//         loadData={loadData}
//         watch={watch}
//         count={count}
//       /> */}

//       {/* <ListPageTableWrapper
//         table={<PatientTable patients={patients} columns={columns} showCols={showCols} />}
//         count={count}
//         watch={watch}
//         loadData={loadData}
//         setValue={setValue}
//       /> */}
//     </Box>
//   );
// }

function ReExaminationList() {
  return <div>ReExaminationList</div>;
}

export default ReExaminationList;
