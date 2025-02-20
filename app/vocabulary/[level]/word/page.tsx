"use client";
import React from "react";

export default function WordPage() {
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col items-center justify-center min-w-[980px] max-w-[980px] min-h-[680px]">
        {/* 검색창 영역 */}
        <div className="w-[800px] h-[50px] rounded-lg flex items-center justify-center border-2 border-nihonred">
          <p>검색창</p>
        </div>

        {/* 단어 학습 카드 및 단어장 추가 박스 영역*/}
        <div className="relative flex flex-col items-center mt-4 w-[800px]">
  
          {/* 단어 학습 카드 */}
          <div className="h-[500px] w-full rounded-lg flex items-center justify-center border-2 border-nihonred">
            <p>단어 학습 카드</p>
          </div>

          {/* 단어장 추가 박스 */}
          <div className="absolute right-[-170px] top-0 w-[160px] h-[120px] rounded-lg p-2 flex items-center justify-center border-2 border-nihonred">
            <p>단어장 추가 박스</p>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-between w-full mt-3">
            <button className="w-[180px] h-[45px] font-bold rounded-lg border-2 border-nihonred">
              한번 더
            </button>
            <button className="w-[180px] h-[45px] bg-red-400 text-white font-bold rounded-lg">
              의미
            </button>
            <button className="w-[180px] h-[45px] font-bold border-2 border-nihonred rounded-lg">
              히라가나
            </button>
            <button className="w-[180px] h-[45px] bg-red-400 text-white font-bold rounded-lg">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
