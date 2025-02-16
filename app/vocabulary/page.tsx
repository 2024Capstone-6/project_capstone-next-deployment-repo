"use client";
import React from "react";

export default function VocabularyPage() {
  return (
    <div className="flex h-screen gap-4">
      {/* 본문 영역 (검색창 + 본문) */}
      <div className="flex-1 flex flex-col min-w-[980px] max-w-[980px] min-h-[600px] rounded-lg m-6 mr-0">
        {/* 검색창 */}
        <div className="h-[60px] bg-gray-300 rounded-lg flex items-center justify-center">
          <p>검색창</p>
        </div>

        {/* 본문 */}
        <div className="flex-1 mt-4 bg-gray-200 rounded-lg p-6 overflow-auto">
          <h2 className="font-bold text-xl">본문</h2>
          <p>본문 내용</p>
        </div>
      </div>

      {/* 학습 진도 및 단어장 영역역 */}
      <div className="xl:flex hidden flex-col min-w-[235px] rounded-lg mt-6 mb-6 mr-6">
        {/* 학습 진도 */}
        <div className="h-[100px] bg-gray-400 rounded-lg flex items-center justify-center">
          <p>학습 진도 공간</p>
        </div>

        {/* 단어장 */}
        <div className="flex-1 mt-4 bg-gray-300 rounded-lg p-6 overflow-auto">
          <p>단어장 공간</p>
        </div>
      </div>
    </div>
  );
}
