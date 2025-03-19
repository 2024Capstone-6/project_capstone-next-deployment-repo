"use client";
import React from "react";
import ScenarioList from "./components/ScenarioList";

export default function ConversationPage() {
  return (
    <div className="flex flex-col items-center min-w-[1150px] max-w-[1150px] min-h-[729px] mx-auto overflow-x-hidden">
      {/* 타이틀 박스 */}
      <h1 className="text-5xl font-bold text-nihonred mt-10">
        상황별로 연습해 보세요!
      </h1>

      <ScenarioList />
    </div>
  );
}
