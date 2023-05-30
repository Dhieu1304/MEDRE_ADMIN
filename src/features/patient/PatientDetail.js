import React, { useEffect, useMemo, useState } from "react";

import { Grid, Select, MenuItem, ListItemText } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import CustomInput from "../../components/CustomInput";

import patientServices from "../../services/patientServices";
import { useFetchingStore } from "../../store/FetchingApiStore/hooks";
import CustomOverlay from "../../components/CustomOverlay";
import { patientInputValidate } from "../../entities/Patient";

import { mergeObjectsWithoutNullAndUndefined } from "../../utils/objectUtil";
import { usePatientGendersContantTranslation } from "./hooks/usePatientConstantsTranslation";
import SectionContent from "../../components/SectionContent";
import PersonDetailWrapper from "../../components/PersonDetailWrapper/PersonDetailWrapper";

function PatientDetail() {
  const [patient, setPatient] = useState();

  const { t } = useTranslation("patientFeature", { keyPrefix: "PatientDetail" });

  const { t: tPatient } = useTranslation("patientEntity", { keyPrefix: "properties" });
  const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });

  const [defaultValues, setDefaultValues] = useState({
    phoneNumber: "",
    name: "",
    address: "",
    gender: "",
    dob: "",
    healthInsurance: ""
  });

  const params = useParams();
  const patientId = useMemo(() => params?.patientId, [params?.patientId]);

  const { isLoading, fetchApi } = useFetchingStore();

  const [patientGenderContantList, patientGenderContantListObj] = usePatientGendersContantTranslation();

  const { control, trigger, reset } = useForm({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all"
  });

  const loadData = async () => {
    await fetchApi(async () => {
      const res = await patientServices.getPatientDetail(patientId);

      if (res.success) {
        const patientData = res?.patient;
        setPatient(patientData);

        const newDefaultValues = {
          ...mergeObjectsWithoutNullAndUndefined(defaultValues, patientData)
        };

        setDefaultValues(newDefaultValues);
        reset(newDefaultValues);

        return { ...res };
      }
      setPatient({});
      return { ...res };
    });
  };
  useEffect(() => {
    loadData();
  }, [patientId]);

  const canUpdatePatient = false;

  // const handleSaveDetail = async ({ phoneNumber, name, address, gender, dob, healthInsurance }) => {
  //   const data = {
  //     phoneNumber,
  //     name,
  //     address,
  //     gender,
  //     dob,
  //     healthInsurance
  //   };

  //   if (canUpdatePatient) {
  //     await fetchApi(async () => {
  //       const res = await patientServices.editPatientInfo(data);
  //       if (res?.success) {
  //         return { success: true };
  //       }

  //
  //       return { error: res.message };
  //     });
  //   }
  // };

  return (
    patient && (
      <PersonDetailWrapper
        person={patient}
        canUpdate={false}
        // handleReset={() => {
        //   reset(defaultValues);
        // }}
        // handleSave={handleSubmit(handleSaveDetail)}
      >
        <CustomOverlay open={isLoading} />

        <SectionContent title={t("title.personality")}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12} lg={4}>
              <CustomInput
                disabled={!canUpdatePatient}
                showCanEditIcon
                control={control}
                rules={{
                  required: tInputValidation("required"),
                  pattern: {
                    value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                    message: tInputValidation("format")
                  }
                }}
                label={tPatient("phoneNumber")}
                trigger={trigger}
                name="phoneNumber"
                type="phone"
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={4}>
              <CustomInput
                disabled={!canUpdatePatient}
                showCanEditIcon
                control={control}
                rules={{
                  required: tInputValidation("required"),
                  maxLength: {
                    value: patientInputValidate.NAME_MAX_LENGTH,
                    message: tInputValidation("maxLength", {
                      maxLength: patientInputValidate.NAME_MAX_LENGTH
                    })
                  }
                }}
                label={tPatient("name")}
                trigger={trigger}
                name="name"
                type="text"
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={4}>
              <CustomInput
                disabled={!canUpdatePatient}
                showCanEditIcon
                control={control}
                rules={{
                  maxLength: {
                    value: patientInputValidate.HEALTH_INSURANCE_MAX_LENGTH,
                    message: tInputValidation("maxLength", {
                      maxLength: patientInputValidate.HEALTH_INSURANCE_MAX_LENGTH
                    })
                  }
                }}
                label={tPatient("healthInsurance")}
                trigger={trigger}
                name="healthInsurance"
                type="text"
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
              <CustomInput
                disabled={!canUpdatePatient}
                showCanEditIcon
                control={control}
                rules={{
                  required: tInputValidation("required")
                }}
                label={tPatient("dob")}
                trigger={trigger}
                name="dob"
                type="date"
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
              <CustomInput
                disabled={!canUpdatePatient}
                showCanEditIcon
                control={control}
                rules={{
                  required: tInputValidation("required"),
                  maxLength: {
                    value: patientInputValidate.GENDER_MAX_LENGTH,
                    message: tInputValidation("maxLength", {
                      maxLength: patientInputValidate.GENDER_MAX_LENGTH
                    })
                  }
                }}
                label={tPatient("gender")}
                trigger={trigger}
                name="gender"
                childrenType="select"
              >
                <Select
                  renderValue={(selected) => {
                    return patientGenderContantListObj[selected]?.label;
                  }}
                >
                  {patientGenderContantList.map((item) => {
                    return (
                      <MenuItem key={item?.value} value={item?.value}>
                        <ListItemText primary={item?.label} />
                      </MenuItem>
                    );
                  })}
                </Select>
              </CustomInput>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <CustomInput
                disabled={!canUpdatePatient}
                showCanEditIcon
                control={control}
                rules={{
                  maxLength: {
                    value: patientInputValidate.ADDRESS_MAX_LENGTH,
                    message: tInputValidation("maxLength", {
                      maxLength: patientInputValidate.ADDRESS_MAX_LENGTH
                    })
                  }
                }}
                label={tPatient("address")}
                trigger={trigger}
                name="address"
                type="text"
                multiline
                rows={6}
              />
            </Grid>
          </Grid>
        </SectionContent>
      </PersonDetailWrapper>
    )
  );
}

export default PatientDetail;
