"use client";

import customFetch from "@/util/custom-fetch";
import { SetStateAction, useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { useSocket } from "../context/context";
import { useRouter } from "next/navigation";

const cookies = new Cookies();

type Room = {
  roomId: string;
  name: string;
  participants: string[];
  status: string;
  maxParticipants: number;
  difficulty?: string;
};

const difficultyLevels = [
  "JLPT N1", "JLPT N2", "JLPT N3", "JLPT N4", "JLPT N5",
  "JPT 550", "JPT 650", "JPT 750", "JPT 850", "JPT 950",
  "BJT J4", "BJT J3", "BJT J2", "BJT J1", "BJT J1+"
];

export default function GameLobby() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState('');
  const [joinedRoom, setJoinedRoom] = useState<Room | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const router = useRouter();
  
  const { socket, isConnected } = useSocket();

  // 1. 소켓 연결
  useEffect(() => {
    if (!socket || !isConnected) return;
    const token = cookies.get('accessToken');
    if (!token) {
      alert('로그인 후 이용하세요.');
      return;
    }

    const handleRoomUpdate = (room: SetStateAction<Room | null>) => {
      setJoinedRoom(room);
    };

    socket.on('roomUpdate', handleRoomUpdate);

    socket.on('error', (err) => {
      alert(err?.message || '에러 발생');
    });

    return () => {
      socket.off('roomUpdate', handleRoomUpdate);
    };
  }, [socket, isConnected]);
  
  const fetchRooms = async () => {
    const res = await customFetch('quiz-game/rooms', {
      method: 'GET',
    });
    const data = await res.json();
    setRooms(data);
  };
  
  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleRoomListUpdate = (room: Room[]) => {
      setRooms(room);
    };

    socket.on("roomListUpdate", handleRoomListUpdate);

    return () => {
      socket.off("roomListUpdate", handleRoomListUpdate);
    };
  }, [socket, isConnected]);

  // 3. 방 생성 (REST)
  const handleCreateRoom = async () => {
    if (!socket || !isConnected) {
      alert("소켓 연결이 아직 완료되지 않았습니다.");
      return;
    }
    if (!newRoomName || !difficulty) {
      alert("방 이름과 난이도를 모두 입력하세요.");
      return;
    }
    const res = await customFetch('quiz-game/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newRoomName, difficulty }),
    });
    const data = await res.json();
    alert('방 생성 완료!');
    setShowModal(false);
    setRoomName('');
    setDifficulty('');
    fetchRooms();
    handleJoinRoom(data.roomId);
  };

  // 4. 방 입장 (Socket)
  const handleJoinRoom = (roomId: string) => {
    if (!socket || !isConnected) {
      alert("소켓 연결이 아직 완료되지 않았습니다.");
      return;
    }
    socket.emit('joinRoom', { roomId });
    router.push(`./group-games/${roomId}`);
  };

  return (
    <div>
      {/* 방 생성 UI */}
      <div className="flex h-[20%] min-h-[40px] mb-2">
        <button
          onClick={() => setShowModal(true)}
          className="w-[10%] h-[40] bg-blue-500 ml-[1%] text-white rounded-md"
        >
          방 생성
        </button>
      </div>

      {/* 방 목록 */}
      <div className="w-[100%] h-[80%] bg-white shadow-md p-4 rounded-md">
  {rooms.length > 0 ? (
    rooms.map((room) => {
      // 상태 텍스트 정리
      const statusText =
        room.status === "playing"
          ? "플레이중"
          : room.status === "lobby"
          ? "대기중"
          : room.status;

      // 플레이중이면 참가 버튼 비활성화
      const isPlaying = room.status === "playing";

      return (
        <div
          key={room.roomId}
          className="h-[50px] flex p-3 justify-between border-b last:border-black-1px"
        >
          <span>
            {room.name} ({room.participants.length}/4) - 난이도: {room.difficulty || 'N/A'}
            <span
              className={`ml-4 px-2 py-1 rounded text-xs font-bold ${
                isPlaying ? "bg-red-200 text-red-600" : "bg-green-200 text-green-700"
              }`}
            >
              {statusText}
            </span>
          </span>
          <button
            onClick={() => {
              if (isPlaying) {
                alert("이미 게임이 시작된 방입니다!");
                return;
              }
              handleJoinRoom(room.roomId);
            }}
            className={`w-[10%] ${
              isPlaying
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500"
            } text-white`}
            disabled={isPlaying}
          >
            참가
          </button>
        </div>
      );
    })
  ) : (
    <p className="text-gray-500 text-center">현재 생성된 방이 없습니다.</p>
  )}
</div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">방 이름/난이도 입력</h2>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
              placeholder="방 이름을 입력하세요"
            />
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            >
              <option value="">난이도 선택</option>
              {difficultyLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                취소
              </button>
              <button
                onClick={handleCreateRoom}
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
