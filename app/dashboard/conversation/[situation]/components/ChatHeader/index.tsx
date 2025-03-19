// 상단 헤더
"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function ChatHeader() {
  const router = useRouter();

  return (
    <div className="w-full flex justify-between items-center px-6 py-3 border-b border-nihonred">
      {/* 뒤로 가기 버튼 */}
      <button 
        className="text-xl font-bold text-gray-700 hover:text-nihonred"
        onClick={() => router.back()}
      >
        ← 뒤로 가기
      </button>

      {/* 실전 회화 버튼 */}
      <button className="px-4 py-2 bg-nihonred text-white font-semibold rounded-lg hover:bg-red-500 transition-all">
        실전 회화
      </button>
    </div>
  );
}
