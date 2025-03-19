"use client";
import React from "react";

interface ChatOptionsProps {
  choices: string[];
  onSelect: (choice: string) => void;
}

export default function ChatOptions({ choices, onSelect }: ChatOptionsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      {choices.map((choice, index) => (
        <button
          key={index}
          className="px-6 py-3 bg-white border-2 border-nihonred text-nihonred font-semibold rounded-lg hover:bg-nihonred hover:text-white transition-all"
          onClick={() => onSelect(choice)}
        >
          {choice}
        </button>
      ))}
    </div>
  );
}
