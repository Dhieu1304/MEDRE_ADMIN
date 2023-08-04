import {
  Divider,
  Grid,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Paper,
  List,
  Fab,
  Box,
  Card,
  CardHeader,
  Button,
  useTheme
} from "@mui/material";
import formatDate from "date-and-time";

import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";

// import { useAuthStore } from "../../store/AuthStore";

import { useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";

import { Done } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import { useFetchingStore } from "../../store/FetchingApiStore";
import ticketServices from "../../services/ticketServices";
import { ticketStatuses } from "../../entities/Ticket";

function TicketDetail() {
  const [ticket, setTicket] = useState();

  const params = useParams();
  const ticketId = params?.ticketId;

  const { t } = useTranslation("ticketFeature", { keyPrefix: "TicketDetail" });

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      content: ""
    }
  });
  const theme = useTheme();
  const { isLoading, fetchApi } = useFetchingStore();

  const loadData = async () => {
    await fetchApi(
      async () => {
        const res = await ticketServices.getTicketDetail(ticketId);

        if (res.success) {
          const ticketData = res?.ticket;
          setTicket(ticketData);

          return { ...res };
        }
        setTicket({});
        return { ...res };
      },
      { hideSuccessToast: true }
    );
  };
  useEffect(() => {
    if (ticketId) {
      loadData();
    }
  }, [ticketId]);

  const handleResponseMessage = async ({ content }) => {
    const data = {
      id: ticketId,
      content
    };

    await fetchApi(async () => {
      const res = await ticketServices.responseTicket(data);

      if (res.success) {
        await loadData();
        reset();
        return { ...res };
      }

      return { ...res };
    });
  };

  const handleFinish = async () => {
    const data = {
      id: ticketId,
      status: ticketStatuses.CLOSE
    };

    await fetchApi(async () => {
      const res = await ticketServices.updateTicket(data);

      if (res.success) {
        await loadData();
        reset();
        return { ...res };
      }

      return { ...res };
    });
  };

  return (
    <>
      <CustomOverlay open={isLoading} />
      <Card
        sx={{
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: 4
        }}
      >
        <CardHeader
          title={ticket?.title}
          action={
            <Box
              sx={{
                display: "flex",
                alignItems: "center"
              }}
            >
              {ticket?.status === ticketStatuses.OPEN ? (
                <Button
                  onClick={handleFinish}
                  sx={{
                    backgroundColor: theme.palette.success.light,
                    color: theme.palette.success.contrastText,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText
                    }
                  }}
                  endIcon={<Done />}
                >
                  {t("button.markFinish")}
                </Button>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <Typography color={theme.palette.success.light}>{t("button.finished")}</Typography>
                  <Done sx={{ ml: 1, color: theme.palette.success.light }} />
                </Box>
              )}
            </Box>
          }
        />
        <Divider />

        <Box component={Paper}>
          <Box>
            <List sx={{ height: "60vh", overflowY: "auto" }}>
              {ticket?.ticketDetails?.map((item) => {
                return item?.idStaff ? (
                  <ListItem key={item?.id}>
                    <Grid container>
                      <Grid item xs={12}>
                        <ListItemText sx={{ textAlign: "right" }} primary={item?.content} />
                      </Grid>
                      <Grid item xs={12}>
                        <ListItemText
                          sx={{ textAlign: "right" }}
                          secondary={formatDate.format(new Date(item?.createdAt), "DD/MM/YY hh:mm")}
                        />
                      </Grid>
                    </Grid>
                  </ListItem>
                ) : (
                  <ListItem key={item?.id}>
                    <Grid container>
                      <Grid item xs={12}>
                        <ListItemText sx={{ textAlign: "left" }} primary={item?.content} />
                      </Grid>
                      <Grid item xs={12}>
                        <ListItemText
                          sx={{ textAlign: "left" }}
                          secondary={formatDate.format(new Date(item?.createdAt), "DD/MM/YY hh:mm")}
                        />
                      </Grid>
                    </Grid>
                  </ListItem>
                );
              })}
            </List>
            <Divider />
            <Grid container sx={{ padding: "20px" }}>
              <Grid item xs={11}>
                <Controller
                  control={control}
                  name="content"
                  rules={{
                    required: true
                  }}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <TextField
                        sx={{
                          height: "100%",
                          width: "100%"
                        }}
                        variant="outlined"
                        value={value}
                        onChange={onChange}
                        fullWidth
                        multiline
                        disabled={ticket?.status === ticketStatuses.CLOSE}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={1} sx={{ textAlign: "right" }}>
                <Fab color="primary" aria-label="add" onClick={handleSubmit(handleResponseMessage)}>
                  <SendIcon />
                </Fab>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Card>
    </>
  );
}

export default TicketDetail;
