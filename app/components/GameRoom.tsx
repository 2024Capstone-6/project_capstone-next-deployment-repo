"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "../context/context";
import GamePage from "./GamePage";

type Room = {
  roomId: string;
  name: string;
  participants: string[];
  status: string;
  maxParticipants: number;
  readyStatus?: Record<string, boolean>; // ✅ 각 참가자별 준비 상태
  difficulty:string;
  totalScores:Record<string, number>;
};

export default function GameRoom({ roomid }: { roomid: string }) {
  const [players, setPlayers] = useState<string[]>([]);
  const [isStart,setIsStart] = useState(false)
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const [readyStatus, setReadyStatus] = useState<Record<string, boolean>>({}); // 준비버튼 눌렀는지 보려고ㅎㅎ 
  const [level,setLevel] = useState('')
  const [totalscores, setTotalScores] = useState<Record<string, number>>({});

  // REST fallback: 방 정보 받아오는 함수
  const fetchRoom = async () => {
    try {
      const res = await fetch(`/api/quiz-game/rooms/${roomid}`);
      if (!res.ok) return;
      const data = await res.json();
      setPlayers(data.participants || []);
    } catch (e) {
      // 에러 무시
    }
  };

  useEffect(() => {
    if (!socket || !isConnected) return;

    // joinRoom emit (방 입장)
    socket.emit("joinRoom", { roomId: roomid });

    // roomUpdate 이벤트 핸들러
    const handleRoomUpdate = (room: Room) => {
      setPlayers(room.participants || []);
      setReadyStatus(room.readyStatus || {});
      setLevel(room.difficulty)
      setTotalScores(room.totalScores || {})
      console.log("방 정보 업데이트:", room);
    };
    socket.on("roomUpdate", handleRoomUpdate);

    // joinRoom emit 후 일정 시간 내에 roomUpdate가 안 오면 fallback
    const timeout = setTimeout(fetchRoom, 1000);

    // roomUpdate가 오면 fallback 취소
    socket.on("roomUpdate", () => {
      clearTimeout(timeout);
    });

    // 클린업
    return () => {
      socket.off("roomUpdate", handleRoomUpdate);
      clearTimeout(timeout);
    };
  }, [socket, isConnected, roomid]);

  useEffect(() => {
  if (!socket) return;

  const handleGameStarted = () => {
    setIsStart(!isStart)
  };

  socket.on("gameStarted", handleGameStarted);

  return () => {
    socket.off("gameStarted", handleGameStarted);
  };
  }, [socket, router, roomid]);

  const startGame = () => {
    if (socket) {
      socket.emit("ready", { roomId: roomid, ready: true });
    }
  };

  const leaveRoom = () => {
    if (socket) {
      socket.emit("leaveRoom", { roomId: roomid });
      router.push("/dashboard/game-mode/group-games");
    }
  };

  const startHandlers = () => {
    setIsStart(!isStart)
  }
    

  return (
    <div>
    {isStart?<GamePage setIsstart={startHandlers} roomId={roomid} level={level} players={players} totalScores={totalscores}></GamePage>:
    <div className="h-screen place-items-center pt-[3%]">
        <h1 className="text-3xl font-bold text-red-500 mb-6">스피드 퀴즈</h1>
          <div className="w-[80%] min-w-[40rem] h-[60%] bg-gray-300 p-6 rounded-lg shadow-lg">
            <div className="h-[80%] grid grid-cols-2 gap-4">
              {players.map((player, index) => (
                <div key={index} className={`h-[100%] bg-white p-4 text-center rounded-md shadow flex flex-col items-center items-center justify-center ${readyStatus[player] ? 'bg-green-300' : 'bg-white'}`}>
                <p className="text-2xl">{player}</p>
                {readyStatus[player] ? (
                <span className="text-green-700 font-bold">✔ 준비완료</span>
                ) : null}
              </div>
            ))}
          </div>
          </div>
          <div className="mt-6 flex gap-4">
            <button onClick={startGame} className="bg-gray-400 text-white px-6 py-2 rounded-md shadow">
              준비완료
            </button>
            <button onClick={leaveRoom} className="bg-gray-400 text-white px-6 py-2 rounded-md shadow">
              방 나가기
            </button>
          </div>
        </div>}
    </div>
  );
}