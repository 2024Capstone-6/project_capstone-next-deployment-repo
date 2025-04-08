"use client";
import React, { useState } from "react";
import WordbookModal from "./components/WordbookModal";
import WordbookItem from "./components/WordbookItem";

export default function Wordbook() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wordbooks, setWordbooks] = useState<string[]>([]); // 단어장 목록

  const handleCreateWordbook = (title: string) => {
    setWordbooks((prev) => [...prev, title]); // 새로운 단어장 추가
  };

  const handleDeleteWordbook = (index: number) => {
    setWordbooks((prev) => prev.filter((_, i) => i !== index)); // 해당 인덱스의 단어장 삭제
  };

  return (
    <div className="flex flex-col items-center min-w-[1150px] max-w-[1150px] min-h-[680px] mx-auto overflow-x-hidden">
      {/* 단어 단어장 카테고리 */}
      <div className="w-full text-left font-bold text-2xl ml-10 mt-14">단어장</div>

      {/* 단어 단어장 목록 영역 */}
      <div className="w-[1120px] min-h-[148px] max-h-[555px] border-2 border-nihonred rounded-lg mt-5 flex flex-wrap p-3 gap-4 mx-auto overflow-hidden overflow-y-auto">
        {/* 생성된 단어장 목록 */}
        {wordbooks.map((title, index) => (
          <WordbookItem key={index} title={title} onDelete={() => handleDeleteWordbook(index)} />
        ))}
        {/* 단어장 추가 버튼 */}
        <div className="w-[120px] h-[120px] border-2 border-nihonred flex items-center justify-center rounded-lg cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <span className="text-5xl font-bold text-nihonred pb-3">+</span>
        </div>
      </div>

      {/* 단어장 추가 모달 */}
      <WordbookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateWordbook}
      />
    </div>
  );
}
