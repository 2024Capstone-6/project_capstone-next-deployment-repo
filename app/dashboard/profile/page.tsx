// app/dashboard/profile/page.tsx
"use client";
import { Pencil } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="w-full flex justify-center px-4 py-28 min-h-[100vh]">
      <div className="w-full max-w-[700px] bg-white rounded-2xl shadow-md p-8 pt-32 relative">
        {/* 프로필 이미지 */}
        <div className="absolute top-[-4rem] left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-nihonred shadow-md border-4 border-white z-10">
          <span>👤</span>
        </div>

        {/* 이름, 수정 아이콘 */}
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <h2 className="text-3xl font-bold">yoojin</h2>
            <Pencil size={20} className="text-nihonred cursor-pointer" />
          </div>
          <p className="text-sm text-gray-500">dbwls437711@gmail.com</p>
        </div>

        {/* 구분선 */}
        <hr className="w-full my-6 border-t border-red-200" />

        {/* 단어장 목록 */}
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">단어장</h3>
          <div className="flex flex-wrap gap-3">
            <div className="border border-nihonred rounded-lg px-4 py-2 shadow-sm hover:bg-red-50 cursor-pointer transition-all">
              방학 특강
            </div>
            <div className="border border-nihonred rounded-lg px-4 py-2 shadow-sm hover:bg-red-50 cursor-pointer transition-all">
              여름 방학
            </div>
            <div className="border border-nihonred rounded-full w-10 h-10 flex items-center justify-center text-nihonred hover:bg-red-50 cursor-pointer transition-all">
              +
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}