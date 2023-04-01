// import { JaaSMeeting, JitsiMeeting } from "@jitsi/react-sdk";
// import React, { useRef, useState } from "react";
// import { teacherDecoded } from "./config";

function MeetingPage() {
  return <div>MeetingPage</div>;
}
export default MeetingPage;

// const MeetingPage = () => {
//   const apiRef = useRef();
//   const [logItems, updateLog] = useState([]);
//   const [showNew, toggleShowNew] = useState(false);
//   const [knockingParticipants, updateKnockingParticipants] = useState([]);

//   const printEventOutput = (payload) => {
//     updateLog((items) => [...items, JSON.stringify(payload)]);
//   };

//   const handleAudioStatusChange = (payload, feature) => {
//     if (payload.muted) {
//       updateLog((items) => [...items, `${feature} off`]);
//     } else {
//       updateLog((items) => [...items, `${feature} on`]);
//     }
//   };

//   const handleChatUpdates = (payload) => {
//     if (payload.isOpen || !payload.unreadCount) {
//       return;
//     }
//     apiRef.current.executeCommand("toggleChat");
//     updateLog((items) => [...items, `you have ${payload.unreadCount} unread messages`]);
//   };

//   const handleKnockingParticipant = (payload) => {
//     updateLog((items) => [...items, JSON.stringify(payload)]);
//     updateKnockingParticipants((participants) => [...participants, payload?.participant]);
//   };

//   const resolveKnockingParticipants = (condition) => {
//     knockingParticipants.forEach((participant) => {
//       apiRef.current.executeCommand("answerKnockingParticipant", participant?.id, condition(participant));
//       updateKnockingParticipants((participants) => participants.filter((item) => item.id === participant.id));
//     });
//   };

//   const handleJitsiIFrameRef1 = (iframeRef) => {
//     iframeRef.style.border = "10px solid #3d3d3d";
//     iframeRef.style.background = "#3d3d3d";
//     iframeRef.style.height = "400px";
//     iframeRef.style.marginBottom = "20px";
//   };

//   const handleJitsiIFrameRef2 = (iframeRef) => {
//     iframeRef.style.marginTop = "10px";
//     iframeRef.style.border = "10px dashed #df486f";
//     iframeRef.style.padding = "5px";
//     iframeRef.style.height = "400px";
//   };

//   const handleJaaSIFrameRef = (iframeRef) => {
//     iframeRef.style.border = "10px solid #3d3d3d";
//     iframeRef.style.background = "#3d3d3d";
//     iframeRef.style.height = "400px";
//     iframeRef.style.marginBottom = "20px";
//   };

//   const handleApiReady = (apiObj) => {
//     apiRef.current = apiObj;
//     apiRef.current.on("knockingParticipant", handleKnockingParticipant);
//     apiRef.current.on("audioMuteStatusChanged", (payload) => handleAudioStatusChange(payload, "audio"));
//     apiRef.current.on("videoMuteStatusChanged", (payload) => handleAudioStatusChange(payload, "video"));
//     apiRef.current.on("raiseHandUpdated", printEventOutput);
//     apiRef.current.on("titleViewChanged", printEventOutput);
//     apiRef.current.on("chatUpdated", handleChatUpdates);
//     apiRef.current.on("knockingParticipant", handleKnockingParticipant);
//   };

//   const handleReadyToClose = () => {
//     /* eslint-disable-next-line no-alert */
//     alert("Ready to close...");
//   };

//   // const generateRoomName = () => `JitsiMeetRoomNo${Math.random() * 100}-${Date.now()}`;

//   const domain = "https://meet.lettutor.com";
//   const roomName = teacherDecoded.roomName;
//   const userDisplayName = teacherDecoded.context.user.name;
//   const userEmail = teacherDecoded.context.user.email;

//   // Multiple instances demo
//   const renderNewInstance = () => {
//     if (!showNew) {
//       return null;
//     }

//     return (
//       <JitsiMeeting
//         domain={domain}
//         userInfo={{
//           displayName: userDisplayName,
//           email: userEmail
//         }}
//         roomName={roomName}
//         getIFrameRef={handleJitsiIFrameRef2}
//       />
//     );
//   };

//   const renderButtons = () => (
//     <div style={{ margin: "15px 0" }}>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center"
//         }}
//       >
//         <button
//           type="text"
//           title="Click to execute toggle raise hand command"
//           style={{
//             border: 0,
//             borderRadius: "6px",
//             fontSize: "14px",
//             background: "#f8ae1a",
//             color: "#040404",
//             padding: "12px 46px",
//             margin: "2px 2px"
//           }}
//           onClick={() => apiRef.current.executeCommand("toggleRaiseHand")}
//         >
//           Raise hand
//         </button>
//         <button
//           type="text"
//           title="Click to MeetingPagerove/reject knocking participant"
//           style={{
//             border: 0,
//             borderRadius: "6px",
//             fontSize: "14px",
//             background: "#0056E0",
//             color: "white",
//             padding: "12px 46px",
//             margin: "2px 2px"
//           }}
//           onClick={() => resolveKnockingParticipants(({ name }) => !name.includes("test"))}
//         >
//           Resolve lobby
//         </button>
//         <button
//           type="text"
//           title="Click to execute subject command"
//           style={{
//             border: 0,
//             borderRadius: "6px",
//             fontSize: "14px",
//             background: "#df486f",
//             color: "white",
//             padding: "12px 46px",
//             margin: "2px 2px"
//           }}
//           onClick={() => apiRef.current.executeCommand("subject", "New Subject")}
//         >
//           Change subject
//         </button>
//         <button
//           type="text"
//           title="Click to create a new JitsiMeeting instance"
//           style={{
//             border: 0,
//             borderRadius: "6px",
//             fontSize: "14px",
//             background: "#3D3D3D",
//             color: "white",
//             padding: "12px 46px",
//             margin: "2px 2px"
//           }}
//           onClick={() => toggleShowNew(!showNew)}
//         >
//           Toggle new instance
//         </button>
//       </div>
//     </div>
//   );

//   const renderLog = () =>
//     logItems.map((item, index) => (
//       <div
//         style={{
//           fontFamily: "monospace",
//           padding: "5px"
//         }}
//         key={index}
//       >
//         {item}
//       </div>
//     ));

//   const renderSpinner = () => (
//     <div
//       style={{
//         fontFamily: "sans-serif",
//         textAlign: "center"
//       }}
//     >
//       Loading..
//     </div>
//   );

//   return (
//     <>
//       <h1
//         style={{
//           fontFamily: "sans-serif",
//           textAlign: "center"
//         }}
//       >
//         JitsiMeeting Demo MeetingPage
//       </h1>
//       <JitsiMeeting
//         roomName={roomName}
//         spinner={renderSpinner}
//         configOverwrite={{
//           subject: "lalalala",
//           hideConferenceSubject: false
//         }}
//         onApiReady={(externalApi) => handleApiReady(externalApi)}
//         onReadyToClose={handleReadyToClose}
//         getIFrameRef={handleJitsiIFrameRef1}
//       />
//       {/* <JaaSMeeting
//         roomName={roomName}
//         // Update this with the `8x8.vc` or `stage.8x8.vc` version of interest
//         // and avoid mixing up different domains and release versions
//         // on the same page at the same time, as only the first
//         // external api script will be loaded.
//         // release = 'release-1234'

//         useStaging={true}
//         getIFrameRef={handleJaaSIFrameRef}
//       />
//       {renderButtons()}
//       {renderNewInstance()}
//       {renderLog()} */}
//     </>
//   );
// };

// export default MeetingPage;

// import { useEffect } from "react";
// import JitsiMeetJS from "lib-jitsi-meet";

// function MeetingPage() {
//   const roomName = "my-jitsi-room";
//   const domain = "meet.jit.si";
//   let connection = null;
//   let isJoined = false;
//   let room = null;

//   useEffect(() => {
//     const options = {
//       hosts: {
//         domain: domain,
//         muc: `conference.${domain}`
//       },
//       bosh: `//${domain}/http-bind?room=${roomName}`,
//       clientNode: "http://jitsi.org/jitsimeet"
//     };

//     connection = new JitsiMeetJS.JitsiConnection(null, null, options);

//     connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
//     connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
//     connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect);

//     JitsiMeetJS.mediaDevices.addEventListener(JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED, onDeviceListChanged);

//     connection.connect();

//     return () => {
//       connection.disconnect();
//       JitsiMeetJS.mediaDevices.removeEventListener(JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED, onDeviceListChanged);
//     };
//   }, []);

//   const onConnectionSuccess = () => {
//     room = connection.initJitsiConference(roomName, {
//       openBridgeChannel: true
//     });
//     room.addEventListener(JitsiMeetJS.events.conference.CONFERENCE_JOINED, onConferenceJoined);
//     room.addEventListener(JitsiMeetJS.events.conference.CONFERENCE_ERROR, onConferenceError);
//     room.addEventListener(JitsiMeetJS.events.conference.CONFERENCE_LEFT, onConferenceLeft);
//   };

//   const onConnectionFailed = (error) => {
//     console.error("Connection Failed!", error);
//   };

//   const disconnect = () => {
//     console.log("Disconnected!");
//   };

//   const onDeviceListChanged = (devices) => {
//     console.info("Device list changed!", devices);
//   };

//   const onConferenceJoined = () => {
//     console.log("Conference joined!");
//     isJoined = true;
//     room.setDisplayName("My Name");
//   };

//   const onConferenceError = (error) => {
//     console.error("Conference Error!", error);
//   };

//   const onConferenceLeft = () => {
//     console.log("Conference left!");
//     isJoined = false;
//   };

//   const joinConference = () => {
//     if (!isJoined) {
//       room.join();
//     }
//   };

//   const leaveConference = () => {
//     if (isJoined) {
//       room.leave();
//     }
//   };

//   return (
//     <div>
//       <h1>Jitsi Meet React MeetingPage</h1>
//       <button onClick={joinConference}>Join Conference</button>
//       <button onClick={leaveConference}>Leave Conference</button>
//     </div>
//   );
// }

// export default MeetingPage;

// import jwt_decode from "jwt-decode";
// import { JitsiMeeting } from "@jitsi/react-sdk";
// import { teacherDecoded } from "./config";

// export default function MeetingPage() {
//   console.log("MeetingPage");
//   const YOUR_DOMAIN = "https://meet.lettutor.com";

//   return (
//     <JitsiMeeting
//       domain={YOUR_DOMAIN}
//       roomName={teacherDecoded.roomName}
//       configOverwrite={{
//         startWithAudioMuted: true,
//         disableModeratorIndicator: true,
//         startScreenSharing: true,
//         enableEmailInStats: false
//       }}
//       interfaceConfigOverwrite={{
//         DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
//       }}
//       userInfo={{
//         displayName: teacherDecoded.context.user.email
//       }}
//       // onApiReady={(externalApi) => {
//       //   // here you can attach custom event listeners to the Jitsi Meet External API
//       //   // you can also store it locally to execute commands
//       // }}
//       getIFrameRef={(iframeRef) => {
//         iframeRef.style.height = "400px";
//       }}
//     />
//   );
// }
