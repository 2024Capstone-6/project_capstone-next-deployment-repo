"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onRestart: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onRestart }) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-lg font-semibold mb-4">학습이 끝났습니다.</p>
        <div className="flex justify-center gap-4">
          <button className="px-6 py-2 bg-red-400 text-white rounded-lg font-bold" onClick={onRestart}>
            다시 학습
          </button>
          <button className="px-6 py-2 bg-gray-300 rounded-lg font-bold" onClick={() => router.push("/dashboard/vocabulary")}>
            메인으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
