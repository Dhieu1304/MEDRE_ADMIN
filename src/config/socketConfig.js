import { io } from "socket.io-client";

const URL = `${process.env.REACT_APP_BE_URL}/socket`;
// console.log("URL: ", URL);

export const socket = io(URL);
