"use client";
import React from "react";
import { useParams } from "next/navigation";
import ChatBubble from "../ChatBubble";
import ChatOptions from "../ChatOptions";
import { useScenario } from "@/app/hooks/useScenario";

export default function ChatWindow() {
  const { situation } = useParams();
  const scenarioId = Number(situation);

  const scenario = useScenario(scenarioId);

  return (
    <div className="relative w-[900px] h-[700px] shadow-md rounded-lg p-6 mx-auto flex flex-col justify-between overflow-hidden">
      {/* 🔼 채팅 영역 */}
      <div className="flex flex-col space-y-4">
        {scenario && scenario.length > 0 && (
          <>
            <ChatBubble
              key={scenario[0].qna_id}
              message={scenario[0].chatbot_question}
              isUser={false}
            />
            <ChatBubble
              key={`${scenario[0].qna_id}-kr`}
              message={scenario[0].kr_answer}
              isUser={true}
            />
          </>
        )}
      </div>

      {/* 🔽 선택지 영역 (항상 아래에 고정됨) */}
      {scenario && scenario.length > 0 && (
        <ChatOptions
          choices={scenario[0].choices}
          blankAnswer={scenario[0].blank_answer}
        />
      )}
    </div>
  );
}
