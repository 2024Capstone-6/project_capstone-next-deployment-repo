import Register from "../components/Register";


export default function registerPage() {

  return (
    <div className="min-h-screen flex flex-col bg-nihonred">
      {/* 상단 배경 */}
      <div className="w-full flex items-center justify-left ml-[5%] text-white text-5xl font-bold text-left p-6 whitespace-nowrap">
        <div>
          SignUp
        </div>
      </div>

      {/* 회원가입입 폼 */}
      <div className="flex-[3] bg-gray-100 flex items-center p-4 px-10 rounded-tr-[200px]">
        <Register/>
      </div>
    </div>
  );
}
