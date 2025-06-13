"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import customFetch from "@/util/custom-fetch";

interface CertificateCardProps {
  level: string;
  wordPath: string;
  grammarPath: string;
}

const CertificateCard: React.FC<CertificateCardProps> = ({
  level,
  wordPath,
  grammarPath,
}) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWordClick = () => {
    setIsModalOpen(true);
  };

  const handleContinue = () => {
    router.push(wordPath);
  };

  const handleRestart = async () => {
    try {
      await customFetch(`words/reset-progress?learning_level=${encodeURIComponent(level)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("❌ 진도 리셋 실패:", err);
    } finally {
      router.push(wordPath);
    }
  };

  return (
    <>
      <div
        className="relative h-24 sm:h-28 w-[80%] max-w-[700px]
                   border-2 border-red-300 rounded-xl flex items-center justify-center
                   text-center font-semibold cursor-pointer transition-all duration-300
                   overflow-hidden group bg-white shadow-md hover:shadow-xl hover:scale-[1.05] flex-shrink-0"
      >
        <span className="group-hover:hidden text-nihonred text-sm sm:text-2xl">
          {level}
        </span>

        <div className="absolute inset-0 flex hidden group-hover:flex">
          <div
            onClick={handleWordClick}
            className="w-1/2 h-full bg-nihonred text-white flex items-center justify-center
                       hover:bg-red-500 transition-all duration-200 text-xs sm:text-lg font-semibold cursor-pointer"
          >
            단어
          </div>

          <a
            href={grammarPath}
            className="w-1/2 h-full bg-white text-black flex items-center justify-center
                       hover:bg-gray-200 transition-all duration-200 text-xs sm:text-lg font-semibold"
          >
            문법
          </a>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg text-center space-y-4">
            <p className="text-lg font-semibold">이어서 학습할까요?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-red-400 text-white rounded-lg font-bold"
                onClick={handleContinue}
              >
                이어하기
              </button>
              <button
                className="px-6 py-2 bg-gray-300 rounded-lg font-bold"
                onClick={handleRestart}
              >
                처음부터
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CertificateCard;
