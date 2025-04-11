"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ChatBubble from "../ChatBubble";
import ChatInput from "../ChatInput";

interface Message {
  role: "user" | "bot";
  text: string;
}

export default function ChatWindowFreeTalk() {
  const searchParams = useSearchParams();
  const situationName = searchParams.get("situation_name") || "";

  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 첫 질문 요청
  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const res = await fetch("http://localhost:4000/chatbot/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ situation: situationName }),
        });
        const data = await res.json();
        setMessages([{ role: "bot", text: data.text }]);
      } catch (err) {
        console.error("초기 메시지 불러오기 실패:", err);
      }
    };

    if (situationName) fetchInitialMessage();
  }, [situationName]);

  // 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // 사용자 입력 처리
  const handleSubmit = async (userInput: string) => {
    setMessages((prev) => [...prev, { role: "user", text: userInput }]);

    try {
      const res = await fetch("http://localhost:4000/chatbot/continue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText: userInput }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.text }]);
    } catch (err) {
      console.error("응답 실패:", err);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col items-center w-full max-h-full overflow-hidden">
      {/* 채팅 영역 */}
      <div
        ref={scrollRef}
        className="flex-1 w-full overflow-y-auto flex justify-center"
      >
        <div className="w-full max-w-[900px] px-4 py-6 space-y-6">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} message={msg.text} isUser={msg.role === "user"} showMeaning={false} />
          ))}
        </div>
      </div>

      {/* 입력창 */}
      <div className="w-full flex justify-center px-4 pb-3 pt-3">
        <div className="w-full max-w-[900px]">
          <ChatInput onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}