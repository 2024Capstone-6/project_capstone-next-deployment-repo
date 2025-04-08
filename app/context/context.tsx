"use client"

import { createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";

// 전역 소켓 객체 생성
const socket = io("http://localhost:4000");
const SocketContext = createContext<Socket>(socket);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
