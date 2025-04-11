"use client";
import React, { useState } from "react";
import { Mic, CornerUpRight } from "lucide-react";

export default function ChatInput({
  onSubmit,
}: {
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (trimmed) {
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

  return (
    <div className="w-full flex justify-center px-4 pb-3 pt-3">
      <div className="w-full max-w-[900px] flex items-center border border-red-300 rounded-3xl px-4 py-2 bg-white">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="대화를 이어나가 보세요"
          className="flex-1 outline-none text-lg text-gray-800 placeholder:text-gray-400 bg-transparent"
        />
        <div className="flex items-center gap-2 ml-2">
          <button className="bg-nihonred text-white p-2 rounded-full hover:bg-red-500">
            <Mic size={18} />
          </button>
          <button
            onClick={handleSend}
            className="bg-nihonred text-white p-2 rounded-full hover:bg-red-500"
          >
            <CornerUpRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}