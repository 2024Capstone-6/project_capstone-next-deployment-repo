"use client";
import React from "react";
import ChatWindow from "../components/ChatWindow";
import ChatHeader from "../components/ChatHeader";

export default function FreeTalkPage() {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <ChatHeader />
      <ChatWindow />
      {/* 🚀 여기에 나중에 ChatInput 추가 예정 */}
    </div>
  );
}
