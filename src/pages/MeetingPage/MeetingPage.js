import { JitsiMeeting } from "@jitsi/react-sdk";
import { Box } from "@mui/material";
import { teacherDecoded } from "./config";

function MeetingPage() {
  const domain = "meet.medre.site";
  const { roomName } = teacherDecoded;

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
  const renderSpinner = () => (
    <div
      style={{
        fontFamily: "sans-serif",
        textAlign: "center"
      }}
    >
      Loading...
    </div>
  );

  const handleReadyToClose = () => {
    /* eslint-disable-next-line no-alert */
    alert("Ready to close...");
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh"
      }}
    >
      <JitsiMeeting
        domain={domain}
        roomName={roomName}
        spinner={renderSpinner}
        configOverwrite={{
          subject: "lalalala",
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
          displayName: teacherDecoded.context.user.email
        }}
        // onApiReady={(externalApi) => {
        //   // here you can attach custom event listeners to the Jitsi Meet External API
        //   // you can also store it locally to execute commands
        // }}
      />
    </Box>
  );
}
export default MeetingPage;
