import { JitsiMeeting } from "@jitsi/react-sdk";
import { Box } from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchingStore } from "../../store/FetchingApiStore";
import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import bookingServices from "../../services/bookingServices";
import routeConfig from "../../config/routeConfig";

function MeetingDetail() {
  const domain = process.env.REACT_APP_JITSI_MEET_URL;
  const [booking, setBooking] = useState();

  // console.log("domain: ", domain);

  const params = useParams();
  const navigate = useNavigate();
  const bookingId = params?.bookingId;
  const { isLoading, fetchApi } = useFetchingStore();

  useEffect(() => {
    const loadData = async () => {
      await fetchApi(
        async () => {
          const res = await bookingServices.getBookingDetail(bookingId);

          if (res.success) {
            const bookingData = res.booking;
            setBooking(bookingData);
            return { ...res };
          }
          setBooking({});
          navigate("/");
          return { ...res };
        },
        { hideSuccessToast: true, hideErrorToast: true }
      );
    };
    loadData();
  }, []);

  const handleJitsiIFrameRef = (iframeRef) => {
    // eslint-disable-next-line no-param-reassign
    iframeRef.style.border = "10px solid #3d3d3d";
    // eslint-disable-next-line no-param-reassign
    iframeRef.style.background = "#3d3d3d";
    // eslint-disable-next-line no-param-reassign
    iframeRef.style.height = "100%";
    // eslint-disable-next-line no-param-reassign
    iframeRef.style.marginBottom = "100%";
  };
  const renderSpinner = () => <CustomOverlay open />;

  const handleReadyToClose = () => {
    navigate(`${routeConfig.booking}/${booking?.id}`);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh"
      }}
    >
      <CustomOverlay open={isLoading} />

      {booking?.code && (
        <JitsiMeeting
          domain={domain}
          roomName={booking?.code}
          spinner={renderSpinner}
          configOverwrite={{
            subject: "",
            hideConferenceSubject: false,
            startWithAudioMuted: true,
            disableModeratorIndicator: true,
            enableEmailInStats: false,
            debug: false
          }}
          onReadyToClose={handleReadyToClose}
          getIFrameRef={handleJitsiIFrameRef}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
          }}
          userInfo={{
            displayName: booking?.bookingOfPatient?.name
          }}
          // onApiReady={(externalApi) => {
          //   // here you can attach custom event listeners to the Jitsi Meet External API
          //   // you can also store it locally to execute commands
          // }}
        />
      )}
    </Box>
  );
}
export default MeetingDetail;
