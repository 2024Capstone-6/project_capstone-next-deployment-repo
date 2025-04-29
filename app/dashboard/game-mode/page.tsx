export default function GameMainLobby() {
  const solo_url = `${process.env.NEXT_PUBLIC_FE_BASE_URL}dashboard/game-mode/select-level`
  const group_url = `${process.env.NEXT_PUBLIC_FE_BASE_URL}dashboard/game-mode/group-games`

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-3xl text-center font-bold text-black mb-6">스피드 퀴즈</h1>
      <div className="grid grid-cols-2 gap-6">
        {/* 땜빵용 솔로모드 */} 
        <a href={solo_url}>
          <div className="w-[400px] h-[550px] border-[2px] border-black rounded-lg flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition hover:text-white">
            <span className="text-xl font-bold">솔로모드</span>
          </div>
        </a>
        {/* 그룹게임 */} 
        <a href={group_url}>
          <div className="w-[400px] h-[550px] border-[2px] border-black rounded-lg flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition hover:text-white">
            <span className="text-xl font-bold">멀티모드(개발중)</span>
          </div>
        </a>
      </div>
    </div>
  );
}