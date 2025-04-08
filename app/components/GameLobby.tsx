// 게임 로비화면

// 생성
// 참가

"use client"

import { useSocket } from "@/app/context/context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import customFetch from "@/util/custom-fetch";

const cookies = new Cookies();

interface Room {
  id: string;
  players: string[];
  isPlaying: boolean;
}

export default function GameLobby(){
  const [rooms, setRooms] = useState<Room[]>([{id:'방1',players:['Player1'],isPlaying:true},{id:'방2',players:['Player1'],isPlaying:true}]);
  const router = useRouter();
  // context를 이용한 socket 전역관리
  const socket = useSocket()

  // 로비 켜면 실행되는 로직
  useEffect(()=>{
    // 룸 정보들 받아오기
    socket.emit("getRooms");
    
    socket.on('room',(updateRooms:Room[])=>{
      setRooms(updateRooms)
    })

    socket.on("createRoom",(roomId)=>{
      handleJoinRoom(roomId).catch((err) => console.error(err))
    })

    return () => {
      socket.off("room");
      socket.off("createRoom");
    }

  },[])


  // 방 참가
  const handleJoinRoom = async (roomId: string) => {
    const playerName = cookies.get("access_token");
    if (!playerName) {
      alert("로그인이 필요합니다.");
      const refreshToken = cookies.get("refreshToken")
      if (!refreshToken) {
        
        return Promise.reject(new Error('Unauthorized'));
      }
      return;
    }
    socket.emit("joinRoom", {roomId, playerName});
    router.push(`/dashboard/game/${roomId}`);
  };

  // 방 생성
  const handleCreateRoom = () => {
    socket.emit("createRoom");
  };

  return(
    <div>
        {/* 방 생성 UI */}
        <div className="h-[5%] flex mb-2">
        <button onClick={handleCreateRoom} className="w-[10%] h-[100%] ml-[90%] bg-blue-500 text-white rounded-md">
          방 생성
        </button>
      </div>

      {/* 방 목록 */}
      <div className="w-[100%] h-[80%] bg-white shadow-md p-4 rounded-md">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div
              onClick={() => handleJoinRoom(room.id)}
              key={room.id}
              className="h-[50px] flex p-3 justify-between border-b last:border-black-1px"
            >
              <span>
                {room.id} ({room.players.length}/4)
              </span>
              <button  className="w-[10%] bg-green-500 text-white">
                참가
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">현재 생성된 방이 없습니다.</p>
        )}
      </div>
    </div>
  )
}