"use client";
import React from "react";
import ChatWindow from "@/app/components/ChatWindow";
import ChatHeader from "@/app/components/ChatHeader";

export default function PracticePage() {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <ChatHeader />
      <ChatWindow />
    </div>
  );
}
