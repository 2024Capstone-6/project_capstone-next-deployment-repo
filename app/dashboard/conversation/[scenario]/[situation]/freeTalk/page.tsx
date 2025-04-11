"use client";
import React from "react";
import ChatWindowFree from "@/app/components/ChatWindow/ChatWindowFree"
import ChatHeader from "@/app/components/ChatHeader";

export default function FreeTalkPage() {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <ChatHeader />
      <ChatWindowFree />
    </div>
  );
}
