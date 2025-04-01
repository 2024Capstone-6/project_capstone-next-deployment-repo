"use client"

import { useSocket } from "@/app/context/context";
import { useRouter } from "next/navigation";
import  { useEffect, useState } from "react";

interface User {
  id : number
  name : string
}

export default function GameRoom(props : {roomid:string}){
  const [players,setPlayers]=useState<User[]>([]) 
  const socket = useSocket()
  const router = useRouter();

  useEffect(()=>{
    if(!props.roomid) return;
    socket.emit("getRoomInfo", props.roomid);

    socket.on("update_players", (players) => setPlayers(players));

    return (()=>{
      socket.off("update_players");
      window.removeEventListener("beforeunload", leaveRoom);
      window.removeEventListener("popstate", leaveRoom);
    })

  },[props.roomid])

  const startGame = () =>{
    socket.emit("startGame",props.roomid)
  }

  const leaveRoom = () => {
    socket.emit("leaveRoom",props.roomid)
    router.push("/dashboard/game")
  }

  return(
    <div className="h-screen place-items-center pt-[3%]">
      <h1 className="text-3xl font-bold text-red-500 mb-6">스피드 퀴즈</h1>
 
      <div className="w-[80%] min-w-[40rem] h-[60%] bg-gray-300 p-6 rounded-lg shadow-lg">
        <div className="h-[80%] grid grid-cols-2 gap-4">
          {players.map((player, index) => (
              <div key={index} className="h-[100%] bg-white p-4 text-center rounded-md shadow">
                {player.name}
              </div>
            ))}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button onClick={startGame} className="bg-gray-400 text-white px-6 py-2 rounded-md shadow">
          게임 시작
        </button>
        <button onClick={leaveRoom} className="bg-gray-400 text-white px-6 py-2 rounded-md shadow">
          방 나가기
        </button>
      </div>
    </div>
  )
}
