"use client"

import { useSocket } from "@/app/context/context";
import { useRouter } from "next/navigation";
import  { useEffect, useState } from "react";



export default function GameRoom(props : {roomid:string}){
  const [players,setPlayers]=useState<string[]>([]) 
  const socket = useSocket()
  const [hasLeft, setHasLeft] = useState(false);
  const router = useRouter();

  const leaveRoom = () => {
    console.log("leaveRoom 호출");
    socket.emit("leaveRoom", props.roomid);
  }

  useEffect(()=>{
    if(!props.roomid) return;
    // socket.emit("getRoomInfo", props.roomid);

    socket.emit("joinRoom",props.roomid);
      socket.on("roomUpdated",(e)=>{
        setPlayers(e.participants)
        if (e.participants.length > 4 && !hasLeft) {
          alert("4명이상입니다.")
          setHasLeft(true);
          leaveRoom();
          router.push("/dashboard/group-games");
        }
      }
    );
    
  return (()=>{
    socket.off("roomUpdated");
  })
  },[props.roomid, socket,router,hasLeft])
  
  const startGame = () =>{
    socket.emit("startGame",props.roomid)
  }
  
  const leaveRoomActive = ()=>{
      leaveRoom()
      router.push("/dashboard/group-games");
  }
  
  return(
    <div className="h-screen place-items-center pt-[3%]">
      <h1 className="text-3xl font-bold text-red-500 mb-6">스피드 퀴즈</h1>
 
      <div className="w-[80%] min-w-[40rem] h-[60%] bg-gray-300 p-6 rounded-lg shadow-lg">
        <div className="h-[80%] grid grid-cols-2 gap-4">
          {players.map((player, index) => (
              <div key={index} className="h-[100%] bg-white p-4 text-center rounded-md shadow">
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
  )
}
