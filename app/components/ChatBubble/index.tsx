"use client";
import React from "react";
import Image from "next/image";
import classNames from "classnames";

interface ChatBubbleProps {
  message: string;
  jp_mean?: string;
  isUser: boolean;
  feedback?: string;
}

export default function ChatBubble({ message, jp_mean, isUser, feedback }: ChatBubbleProps) {
  return (
    <div
      className={classNames("flex items-end space-x-2 w-full", {
        "justify-end": isUser,
      })}
    >
      {!isUser && (
        <Image
          src="/navbar/game.png"
          alt="챗봇"
          width={32}
          height={32}
          className="rounded-full"
        />
      )}

      <div
        className={classNames(
          "px-4 py-2 rounded-xl text-lg break-words max-w-[75%] md:max-w-[65%] lg:max-w-[60%]",
          isUser ? "bg-nihonred text-white" : "border-2 border-nihonred text-gray-900"
        )}
      >
        <p>{message}</p>
        {!isUser && (
          <>
            <hr className="my-2 border-t border-black opacity-40" />
            <p className="text-base">{jp_mean}</p>
          </>
        )}
        {feedback && (
          <>
            <hr className="my-2 border-t border-white opacity-40" />
            <p className="text-base text-white">{feedback}</p>
          </>
        )}
      </div>

      {isUser && (
        <Image
          src="/navbar/profile.png"
          alt="유저"
          width={32}
          height={32}
          className="rounded-full"
        />
      )}
    </div>
  );
}
