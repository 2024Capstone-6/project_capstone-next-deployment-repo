"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface WordbookItemProps {
  id: number;
  title: string;
  type: "word" | "grammar";
  onDelete: () => void;
  items: number[]; // 해당 단어장이 가진 단어/문법 id 배열
}

const WordbookItem: React.FC<WordbookItemProps> = ({ id, title, type, onDelete, items }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEmptyModalOpen, setIsEmptyModalOpen] = useState(false);
  const router = useRouter();

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleteModalOpen(true);
  };

  const handleClick = () => {
    if (items.length === 0) {
      setIsEmptyModalOpen(true);
      return;
    }
    router.push(`/dashboard/vocabulary/wordbook/${id}/${type}`);
  };

  const handleDelete = () => {
    onDelete();
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="w-[120px] h-[120px] border-2 border-nihonred flex items-center justify-center rounded-lg cursor-pointer"
        onContextMenu={handleRightClick}
        onClick={handleClick}
      >
        <span
          className="truncate w-[100px] px-1 text-sm font-bold text-center"
          title={title}
        >
          {title}
        </span>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">단어장을 삭제할까요?</p>
            <div className="flex justify-center gap-2">
              <button
                className="px-8 py-2 bg-red-400 text-white rounded-lg font-bold"
                onClick={handleDelete}
              >
                삭제
              </button>
              <button
                className="px-8 py-2 bg-gray-300 rounded-lg font-bold"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {isEmptyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">단어장이 비어 있습니다.</p>
            <div className="flex justify-center gap-2">
              <button
                className="px-8 py-2 bg-gray-300 rounded-lg font-bold"
                onClick={() => setIsEmptyModalOpen(false)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordbookItem;
