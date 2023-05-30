import { io } from "socket.io-client";

export const SOCKET = {
  // socket
  CONNECT: "connect",
  DISCONNECT: "isconnect",
  CONNECT_ERROR: "connect_error",

  // custom
  SUCCESS: "Success",
  ERROR: "Error",
  NOTIFICATION: "Notification",
  // emit
  JOIN_ROOM: "JoinRoom"
};

const URL = `${process.env.REACT_APP_BE_URL}/socket`;
// console.log("URL: ", URL);

export const socket = io(URL);
