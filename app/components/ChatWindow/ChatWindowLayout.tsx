"use client";
import React, { ReactNode } from "react";

interface ChatWindowLayoutProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  chatContent: ReactNode;
  optionsContent?: ReactNode;
}

export default function ChatWindowLayout({
  scrollRef,
  chatContent,
  optionsContent,
}: ChatWindowLayoutProps) {
  return (
    <div className="relative flex-1 flex flex-col items-center w-full max-h-full overflow-hidden">
      {/* 채팅 영역 */}
      <div
        ref={scrollRef}
        className="flex-1 w-full overflow-y-auto flex justify-center"
      >
        <div className="w-full max-w-[900px] px-4 py-6 space-y-6">
          {chatContent}
          <div className="h-[1px]" />
        </div>
      </div>

      {/* 선택지 영역 */}
      {optionsContent && (
        <div className="w-full flex justify-center px-4 pb-3 pt-3">
          <div className="w-full max-w-[900px]">{optionsContent}</div>
        </div>
      )}
    </div>
  );
}
