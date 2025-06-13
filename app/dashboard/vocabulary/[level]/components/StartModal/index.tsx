"use client";

import React from "react";

interface StartModalProps {
  onStartNew: () => void;
  onResume: () => void;
}

const StartModal: React.FC<StartModalProps> = ({ onStartNew, onResume }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-lg font-semibold mb-4">이전에 학습한 기록이 있습니다.</p>
        <p className="text-sm mb-6">이어하기를 선택하면 이전 학습 위치부터 시작합니다.</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-2 bg-red-400 text-white rounded-lg font-bold"
            onClick={onStartNew}
          >
            처음부터
          </button>
          <button
            className="px-6 py-2 bg-gray-300 rounded-lg font-bold"
            onClick={onResume}
          >
            이어하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartModal;
