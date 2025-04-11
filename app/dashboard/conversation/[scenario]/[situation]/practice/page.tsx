"use client";
import React from "react";
import ChatWindow from "@/app/components/ChatWindow/ChatWindow";
import ChatHeader from "@/app/components/ChatHeader";

export default function PracticePage() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <ChatHeader />
      <ChatWindow />
    </div>
  );
}
