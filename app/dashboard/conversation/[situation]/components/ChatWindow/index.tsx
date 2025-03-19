"use client";
import React from "react";
import { useParams } from "next/navigation";
import ChatBubble from "../ChatBubble";
import { useScenario } from "@/app/hooks/useScenario";

export default function ChatWindow() {
  const { situation } = useParams();
  const scenarioId = Number(situation);

  // 🚀 커스텀 훅을 여기서 사용하여 데이터 가져오기
  const scenario = useScenario(scenarioId);

  return (
    <div className="flex-1 w-full max-w-[900px] shadow-md rounded-lg p-6 overflow-y-auto">
      <div className="flex flex-col space-y-4">
        {scenario && <ChatBubble message={scenario.chatbot_message} isUser={false} />}
      </div>
    </div>
  );
}
