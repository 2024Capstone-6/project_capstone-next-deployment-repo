"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface WordbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

const WordbookModal: React.FC<WordbookModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => {
    setTitle("");
    onClose();
  };

  const handleCreate = () => {
    if (title.trim() === "") return;
    onCreate(title);
    setTitle("");
    onClose();
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
      <div className="bg-white p-2 px-5 pl-3 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4">단어장 추가</h2>
        <input
          type="text"
          className="border p-2 mx-1 w-full"
          placeholder="단어장 이름을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-center gap-2 mt-4 ml-2">
          <button className="px-8 py-2 bg-red-400 text-white rounded-lg font-bold" onClick={handleCreate}>
            생성
          </button>
          <button className="px-8 py-2 bg-gray-300 rounded-lg font-bold" onClick={handleClose}>
            취소
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WordbookModal;
