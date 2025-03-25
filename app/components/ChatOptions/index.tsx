"use client";
import React from "react";

interface Choice {
  text: string;
  reason: string;
  is_correct: boolean;
}

interface ChatOptionsProps {
  choices: Choice[];
  blankAnswer: string;
}

export default function ChatOptions({ choices, blankAnswer }: ChatOptionsProps) {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[800px]">
      {/* 🟨 빈칸 문장 표시 */}
      <div className="mb-4 px-6 py-3 border border-red-300 rounded-md text-lg bg-white text-gray-800 shadow-sm w-full text-center">
        {blankAnswer}
      </div>

      {/* ✅ 선택지 버튼 */}
      <div className="flex flex-wrap justify-center gap-4 px-6 py-4 border border-red-300 rounded-md shadow-md bg-white w-full">
        {choices.map((choice, idx) => (
          <button
            key={idx}
            className="px-6 py-2 bg-white text-gray-900 text-base font-medium rounded-md border border-gray-300 shadow hover:bg-gray-100 transition-all"
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}
