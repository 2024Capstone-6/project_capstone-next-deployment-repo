import LoginCompo from "../components/Login";


export default function LoginPage() {

  return (
    <div className="min-h-screen flex flex-col bg-nihonred">
      {/* 상단 배경 */}
      <div className="w-full flex-[3] flex items-center justify-left ml-[5%] text-white text-7xl font-bold text-left p-6 whitespace-nowrap">
        <div>
          배우는 즐거움, <br />ここで、一緒に<br />여기서 시작하세요!
        </div>
      </div>

      {/* 로그인 폼 */}
      <div className="flex-[3] bg-gray-100 flex items-center p-4 px-10 rounded-tl-[200px]">
        <LoginCompo/>
      </div>
    </div>
  );
}