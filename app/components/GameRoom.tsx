"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useSocket } from "../context/context";

export default function GameRoom({ roomid }: { roomid: string }) {
  const [players, setPlayers] = useState<string[]>([]);
  const router = useRouter();

  const socket = useSocket()

  const leaveRoom = () => {
    if (socket) {
      console.log("leaveRoom 호출");
      socket.emit("leaveRoom", roomid);
      socket.disconnect(); // 소켓 종료
    }
  };

  useEffect(() => {
    socket.emit("joinRoom", roomid);

    socket.on("roomUpdated", (e) => {
      setPlayers(e.participants);
      const myId = socket.id;
      if (e.participants.length > 4 && e.participants.includes(myId)) {
        alert("4명이 초과되어 나갑니다.");
        leaveRoom();
        router.push("/dashboard/group-games");
      }
    });

    return () => {
      socket.emit("leaveRoom", roomid);
      socket.disconnect();
    };
  }, [roomid, router]);

  const startGame = () => {
    if (socket) {
      socket.emit("startGame", roomid);
    }
  };

  const leaveRoomActive = () => {
    leaveRoom();
    router.push("/dashboard/group-games");
  };

  return (
    <div className="h-screen place-items-center pt-[3%]">
      <h1 className="text-3xl font-bold text-red-500 mb-6">스피드 퀴즈</h1>
      <div className="w-[80%] min-w-[40rem] h-[60%] bg-gray-300 p-6 rounded-lg shadow-lg">
        <div className="h-[80%] grid grid-cols-2 gap-4">
          {players.map((player, index) => (
            <div
              key={index}
              className="h-[100%] bg-white p-4 text-center rounded-md shadow"
            >
              {player}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button onClick={startGame} className="bg-gray-400 text-white px-6 py-2 rounded-md shadow">
          준비완료
        </button>
        <button onClick={leaveRoomActive} className="bg-gray-400 text-white px-6 py-2 rounded-md shadow">
          방 나가기
        </button>
      </div>
    </div>
  );
}
