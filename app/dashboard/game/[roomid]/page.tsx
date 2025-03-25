// 방 접속 후 화면

// 인원 최신화
// 인원 준비상태 최신화
// 게임 시작요청
// 방 나가기
// 강퇴?
// 채팅?




import GameRoom from "@/app/components/GameRoom"
import React from "react"

export default function RoomDetail({params}:{params:Promise<{roomid:string}>}){
  const {roomid} = React.use(params) // 내 파라미터 받아오는 최신문법


    
  
  return(
    <div>
      <h1>RoomId :{roomid}</h1>
      <GameRoom roomid={roomid}></GameRoom>
    </div>
  )
}