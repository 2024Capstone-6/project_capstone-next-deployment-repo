// 방 접속 후 화면

// 인원 최신화
// 인원 준비상태 최신화
// 게임 시작요청
// 방 나가기
// 강퇴?
// 채팅?


// "use client"
// import { useSocket } from "@/app/context/context";
// import React, { useEffect, useState } from "react";


export default async function RoomDetail({params}:{params:Promise<{roomid:string}>}){
  // const {roomid} = React.use(params) // 내 파라미터 받아오는 최신문법
  const roomid = (await params).roomid
  // const [players,setPlayers]=useState([])
  // const socket = useSocket()

  // useEffect(()=>{

  //   socket.on("update_players", (players) => setPlayers(players));

  //   return (()=>{
  //     socket.off("update_players");
  //   })
  // },[])

  const startGame = () =>{
    
  }
  return(
    <div>
      <h1>RoomId :{roomid}</h1>
    </div>
  )
}