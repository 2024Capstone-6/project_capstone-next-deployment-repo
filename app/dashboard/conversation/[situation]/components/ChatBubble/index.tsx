// 말풍선 컴포넌트
"use client";
import React from "react";
import Image from "next/image";
import classNames from "classnames";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
}

export default function ChatBubble({ message, isUser }: ChatBubbleProps) {
  return (
    <div className={classNames("flex items-end space-x-2", { "justify-end": isUser })}>
      {/* 챗봇 아이콘 (유저일 때는 안 보임) */}
      {!isUser && (
        <Image src="/navbar/game.png" alt="챗봇" width={32} height={32} className="rounded-full" />
      )}

      {/* 말풍선 */}
      <div
        className={classNames(
          "px-4 py-2 rounded-lg max-w-[70%] text-lg",
          isUser ? "bg-nihonred text-white" : "border-2 border-nihonred text-gray-900"
        )}
      >
        {message}
      </div>

      {/* 유저 아이콘 (챗봇일 때는 안 보임) */}
      {isUser && (
        <Image src="/navbar/profile.png" alt="유저" width={32} height={32} className="rounded-full" />
      )}
    </div>
  );
}
