"use client";
import React, { useState } from "react";

interface WordbookItemProps {
  title: string;
  onDelete: () => void;
}

const WordbookItem: React.FC<WordbookItemProps> = ({ title, onDelete }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault(); // 기본 우클릭 메뉴 방지
    setIsDeleteModalOpen(true);
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
      >
        <span className="text-lg font-bold">{title}</span>
      </div>

      {/* 삭제 모달 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">단어장을 삭제할까요?</p>
            <div className="flex justify-center gap-2">
              <button className="px-8 py-2 bg-red-400 text-white rounded-lg font-bold" onClick={handleDelete}>
                삭제
              </button>
              <button className="px-8 py-2 bg-gray-300 rounded-lg font-bold" onClick={() => setIsDeleteModalOpen(false)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordbookItem;
