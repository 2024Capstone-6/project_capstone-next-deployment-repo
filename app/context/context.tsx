"use client"
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      const token = document.cookie
        .split('; ')
        .find((c) => c.startsWith('accessToken='))
        ?.split('=')[1];

      const socket = io('BASE_URL', {
        auth: { token },
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        setIsConnected(true);
        console.log('✅ 소켓 연결됨:', socket.id);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        console.log('❌ 소켓 연결 해제됨');
      });
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, isConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
