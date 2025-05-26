import Link from "next/link";

export default function GameMainLobby() {
  

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-3xl text-center font-bold text-black mb-6">스피드 퀴즈</h1>
      <div className="grid grid-cols-2 gap-6">
        {/* 땜빵용 솔로모드 */} 
        <Link href="./game-mode/select-level">
          <div className="w-[400px] h-[550px] border-[2px] border-black rounded-lg flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition hover:text-white">
            <span className="text-xl font-bold">솔로모드</span>
          </div>
        </Link>
        {/* 그룹게임 */}
        <Link href='./game-mode/group-games'>
          <div className="w-[400px] h-[550px] border-[2px] border-black rounded-lg flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition hover:text-white">
            <span className="text-xl font-bold">멀티모드(개발중)</span>
          </div>
        </Link>
      </div>
    </div>
  );
}