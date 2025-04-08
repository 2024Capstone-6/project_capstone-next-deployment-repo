"use client";
import React, { useState } from "react";

export default function ChatInput() {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    console.log("유저 입력:", input); // TODO: 백엔드로 데이터 전송
    setInput(""); // 입력값 초기화
  };

  return (
    <div className="mt-4 flex items-center border-t pt-4">
      <input
        type="text"
        className="flex-1 border rounded-lg px-4 py-2 text-lg"
        placeholder="메시지를 입력하세요..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="ml-2 px-4 py-2 bg-nihonred text-white rounded-lg hover:bg-red-500 transition-all"
        onClick={handleSend}
      >
        전송
      </button>
    </div>
  );
}
