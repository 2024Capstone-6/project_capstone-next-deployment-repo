"use client"

import { useSocket } from "@/app/context/context";
import  { useEffect, useState } from "react";

export default function GameRoom(props : {roomid:string}){
  const [players,setPlayers]=useState([]) 
  const socket = useSocket()

  useEffect(()=>{

    socket.on("update_players", (players) => setPlayers(players));

    return (()=>{
      socket.off("update_players");
    })
  },[])
  const startGame = () =>{

  }
  return(
  <div>

  </div>
  )
}
