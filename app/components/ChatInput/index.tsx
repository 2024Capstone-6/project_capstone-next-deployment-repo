"use client";

import React, { useState } from "react";
import { CornerUpRight, Mic } from "lucide-react";

interface ChatInputProps {
  onSubmit: (text: string) => void;
  isSending: boolean;
}

const predefinedTexts = [
  "はい、どうぞ。",
  "すみません、まだ確認していません。",
];

export default function ChatInput({ onSubmit, isSending }: ChatInputProps) {
  const [text, setText] = useState("");
  const [recordStep, setRecordStep] = useState(0);
  const [voiceIndex, setVoiceIndex] = useState(0);

  const handleSend = () => {
    const trimmed = text.trim();
    if (trimmed && !isSending) {
      onSubmit(trimmed);
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFakeVoiceClick = () => {
    if (isSending) return;
    if (recordStep === 0) {
      setRecordStep(1); // 녹음 시작 상태
    } else {
      const fakeText = predefinedTexts[voiceIndex] || "（・・・）";
      onSubmit(fakeText);
      setVoiceIndex((prev) => prev + 1);
      setRecordStep(0); // 녹음 종료 상태
    }
  };

  return (
    <div className="w-full flex justify-center px-4 pb-3 pt-3">
      <div className="w-full max-w-[900px] flex items-center border border-red-300 rounded-3xl px-3 sm:px-4 py-2 bg-white shadow-sm">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="대화를 이어나가 보세요"
          className="flex-1 outline-none text-base sm:text-lg text-gray-800 placeholder:text-gray-400 bg-transparent"
          disabled={isSending}
        />
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={handleFakeVoiceClick}
            className={`p-2 rounded-full transition-all ${
              recordStep === 1 ? "bg-red-500 text-white" : "bg-nihonred text-white hover:bg-red-500"
            }`}
            disabled={isSending}
          >
            <Mic size={18} />
          </button>
          <button
            onClick={handleSend}
            className="bg-nihonred text-white p-2 rounded-full hover:bg-red-500 transition-all"
            disabled={isSending}
          >
            <CornerUpRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}