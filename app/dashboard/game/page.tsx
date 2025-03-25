import GameLobby from "@/app/components/GameLobby";

export default function GameMainLobby() {


  return (
    <div className="h-[100%] min-w-[500px] items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="w-[100%] h-[5%] text-3xl text-center font-bold text-red-500 mb-6">게임 로비</h1>
      <GameLobby></GameLobby>
    </div>
  );
}
