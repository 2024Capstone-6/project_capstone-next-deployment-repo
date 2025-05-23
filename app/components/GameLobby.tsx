// 게임 로비화면

"use client"

import { io } from "socket.io-client";
import customFetch from "@/util/custom-fetch";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

interface Room {
  id: string;
  room_name: string;
  players: string[];
  isPlaying: boolean;
}

export default function GameLobby() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const router = useRouter();
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = io("http://localhost:4000", {
      withCredentials: true,
    });
    socketRef.current = socket;

    const fetchRooms = async () => {
      try {
        const res = await customFetch("api/rooms", {
          method: "GET"
        });
        if (res.ok) {
          const roomData = await res.json();
          const roomDatas: Room[] = roomData.map((room: any) => ({
            id: room.roomId || room._id,
            players: room.participants || [],
            room_name: room.name,
            isPlaying: room.status === "playing"
          }));
          setRooms(roomDatas);
        } else {
          console.error("방 목록을 가져오는 데 실패했습니다.");
        }
      } catch (err) {
        console.error("방 목록 fetch 중 오류:", err);
      }
    };

    fetchRooms();

    socket.on("room", (updateRooms: Room[]) => {
      setRooms(updateRooms);
    });

    socket.on("createRoom", (roomId: string) => {
      handleJoinRoom(roomId).catch((err) => console.error(err));
    });

    return () => {
      socket.off("room");
      socket.off("createRoom");
      socket.disconnect();
    };
  }, []);

  const handleJoinRoom = async (roomId: string) => {
    const playerName = cookies.get("accessToken");
    if (!playerName) {
      alert("로그인이 필요합니다.");
      const refreshToken = cookies.get("refreshToken");
      if (!refreshToken) {
        return Promise.reject(new Error("Unauthorized"));
      }
      return;
    }

    try {
      const res = await customFetch(`api/rooms/${roomId}`, {
        method: "GET"
      });

      if (!res.ok) {
        alert("존재하지 않는 방입니다.");
        return;
      }
    } catch (err) {
      console.error("방 유효성 확인 중 오류:", err);
      alert("서버 오류로 방에 입장할 수 없습니다.");
      return;
    }

    router.push(`/dashboard/group-games/${roomId}`);
  };

  const handleCreateRoom = () => {
    setShowModal(true);
  };

  const submitCreateRoom = () => {
    socketRef.current?.emit("createRoom", newRoomName);
    socketRef.current?.on("roomCreated", (room: any) => {
      handleJoinRoom(room.roomId);
    });
    setShowModal(false);
  };

  return (
    <div>
      {/* 방 생성 UI */}
      <div className="flex h-[20%] min-h-[40px] mb-2">
        <button
          onClick={handleCreateRoom}
          className="w-[10%] h-[40] bg-blue-500 ml-[1%] text-white rounded-md"
        >
          방 생성
        </button>
      </div>

      {/* 방 목록 */}
      <div className="w-[100%] h-[80%] bg-white shadow-md p-4 rounded-md">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div
              key={room.id}
              className="h-[50px] flex p-3 justify-between border-b last:border-black-1px"
            >
              <span>
                {room.room_name} ({room.players.length}/4)
              </span>
              <button
                onClick={() => handleJoinRoom(room.id)}
                className="w-[10%] bg-green-500 text-white"
              >
                참가
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">현재 생성된 방이 없습니다.</p>
        )}
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">방 이름 입력</h2>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
              placeholder="방 이름을 입력하세요"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                취소
              </button>
              <button
                onClick={submitCreateRoom}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
