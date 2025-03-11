// 방 접속 후 화면

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io('http://localhost:4000')

export default function RoomDetail(props: any){
  
  const [players,setPlayers]=useState([])

  useEffect(()=>{
    if(!props) return;

    socket.emit("join room",{roomid:props,playerName:"닉네임"})

    socket.on("update_players", (players) => setPlayers(players));

    return (()=>{
      socket.disconnect();
    })
  },[props])

  const startGame = () =>{
    
  }
}