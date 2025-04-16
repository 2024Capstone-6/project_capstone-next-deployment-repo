import GamePage from "@/app/components/GamePage";
import React from "react";

export default function Game({params}:{params:Promise<{roomid:string}>}) {
  const roomId = React.use(params);

  return (
    <div className="h-screen w-[100%] bg-gray-100 flex flex-col items-center p-6">
      {/* 네비게이션 바 */}
      <GamePage roomId={roomId.roomid}></GamePage>
    </div>
  );
}
