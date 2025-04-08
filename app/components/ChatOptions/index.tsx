"use client";
import React, { useState } from "react";

interface Choice {
  text: string;
  reason: string;
  is_correct: boolean;
}

interface ChatOptionsProps {
  choices: Choice[];
  blankAnswer: string;
  feedback?: string;
  onSelect: (selected: string) => void;
}

export default function ChatOptions({
  choices,
  blankAnswer,
  feedback,
  onSelect,
}: ChatOptionsProps) {
  const [shakingChoice, setShakingChoice] = useState<string | null>(null);

  const handleClick = (choice: Choice) => {
    onSelect(choice.text);

    if (!choice.is_correct) {
      // 오답이면 흔들림 초기화 후 재적용
      setShakingChoice(null);
      setTimeout(() => {
        setShakingChoice(choice.text);
      }, 10);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* 빈칸 문장 + 피드백 */}
      <div className="mb-4 px-6 py-3 border border-red-300 rounded-md text-lg bg-white text-gray-800 shadow-sm w-full max-w-3xl text-center flex flex-col items-center">
        {feedback && (
          <p className="text-base text-red-600 font-semibold mb-2">{feedback}</p>
        )}
        {blankAnswer}
      </div>

      {/* 선택지 버튼 */}
      <div className="flex flex-wrap justify-center gap-7 px-6 py-4 border border-red-300 rounded-md shadow-md bg-white w-full max-w-3xl">
        {choices.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(choice)}
            className={`min-w-[150px] max-w-[150px] text-center px-4 py-2 bg-white text-gray-900 text-sm md:text-base font-medium rounded-md border border-gray-300 shadow hover:bg-gray-100 transition-all ${
              shakingChoice === choice.text ? "animate-shake" : ""
            }`}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}
