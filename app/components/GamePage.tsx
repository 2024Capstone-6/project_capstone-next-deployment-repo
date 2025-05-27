"use client"

// import { useSocket } from "@/app/context/context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSocket } from "../context/context";


export default function GamePage(props:{roomId:string}){
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(456);
  const [timer, setTimer] = useState(10);
  const [players, setPlayers] = useState([
    { id: 1, name: "user 1", status: "waiting" },
    { id: 2, name: "user 2", status: "wrong" },
    { id: 3, name: "user 3", status: "waiting" },
  ]);
  const socket = useSocket()

  useEffect(() => {
    // 타이머 1초씩 줄어드는 로직
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  return(
    <div className="w-[100%] h-[70%]">
      <div className="w-full flex justify-between items-center bg-red-400 p-4 text-white rounded-md font-bold text-lg">
        <span>JLPT N2</span>
        <button className="bg-white text-red-500 px-4 py-2 rounded-md">
          나가기
        </button>
      </div>

      {/* 문제 박스 */}
      <div className="w-[100%] min-w-[40rem] h-[100%] bg-white p-6 mt-6 shadow-lg rounded-md text-center">
        {/* 타이머 */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-red-500">⏳ {timer}</span>
          <div className="w-full bg-gray-200 h-2 mx-2 rounded-full">
            <div className="bg-red-400 h-2 rounded-full" style={{ width: `${(timer / 10) * 100}%` }}></div>
          </div>
          <span className="text-red-500">My Score: {score}</span>
        </div>
        {/* 문제 */}
        <div>
          <h1 className="text-4xl font-bold text-red-500">{question}</h1>
        </div>
      </div>

      {/* 선택지 */}
      <div className="grid grid-cols-2 gap-4 mt-6 w-[60%] min-w-[40rem]">
        {choices.map((choice, index) => (
          <button key={index} className="bg-white shadow p-4 rounded-md border border-red-300 text-lg">
            {choice}
          </button>
        ))}
      </div>

      {/* 플레이어 상태 */}
      <div className="flex gap-6 mt-6">
        {players.map((player) => (
          <div key={player.id} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                player.status === "wrong" ? "bg-red-500" : "bg-gray-300"
              }`}
            >
              ...
            </div>
            <span className="text-sm mt-1">{player.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}