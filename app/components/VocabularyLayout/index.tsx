"use client";
import Image from "next/image";
import React, { useState } from "react";
import Modal from "@/app/components/Modal";

interface Word {
  word_id: number;
  word: string;
  word_furigana: string;
  word_meaning: string;
  word_level: string;
}

interface VocabularyLayoutProps {
  words: Word[];
}

export default function VocabularyLayout({ words }: VocabularyLayoutProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibility, setVisibility] = useState({
    furigana: false,
    mean: false,
    workbook: false,
  });

  // 현재 단어 가져오기 (단어가 없을 경우 기본값 방어)
  const currentWord = words[currentIndex] || { word: "", word_furigana: "", word_meaning: "" };

  // 단어장 추가 버튼
  const toggleVisibility = (key: "furigana" | "mean" | "workbook") => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 다음 단어 보기
  const handleNextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setVisibility({ furigana: false, mean: false, workbook: false });
    } else {
      setIsModalOpen(true); // 마지막 단어 도달 시 모달 열기
    }
  };

  // 다시 학습 버튼 클릭 시 랜덤 섞기
  const restartLearning = () => {
    setCurrentIndex(0);
    setVisibility({ furigana: false, mean: false, workbook: false });
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col items-center justify-center min-w-[980px] max-w-[980px] min-h-[680px]">
        {/* 검색창 영역 */}
        <div className="w-[800px] h-[50px] rounded-lg flex items-center justify-center border-2 border-nihonred">
          <p>검색창</p>
        </div>

        {/* 단어 학습 카드 및 단어장 추가 박스 영역 */}
        <div className="relative flex flex-col items-center mt-4 w-[800px]">
          {/* 단어 학습 카드 */}
          <div className="h-[500px] w-full rounded-lg flex flex-col items-center justify-center border-2 border-nihonred relative">
            {/* 북마크 버튼 */}
            <button
              className="absolute right-4 top-4 bg-transparent text-red-400 text-2xl"
              onClick={() => toggleVisibility("workbook")}
            >
              <Image src={"/bookmark/bookmark.png"} alt="bookmark" width={30} height={30} unoptimized />
            </button>

            {/* 본문 내용 */}
            {visibility.furigana && <p className="text-nihonred text-4xl">{currentWord.word_furigana}</p>}
            <p className="text-black text-8xl font-bold">{currentWord.word}</p>
            {visibility.mean && <p className="text-nihonred text-4xl font-semibold pt-3">{currentWord.word_meaning}</p>}
          </div>

          {/* 단어장 추가 박스 */}
          {visibility.workbook && (
            <div className="absolute right-[-170px] top-0 w-[160px] h-[120px] rounded-lg p-2 flex items-center justify-center border-2 border-nihonred">
              <p>단어장 추가 박스</p>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex justify-between w-full mt-3">
            <button className="w-[180px] h-[45px] font-bold rounded-lg border-2 border-nihonred">한번 더</button>
            <button className="w-[180px] h-[45px] bg-red-400 text-white font-bold rounded-lg" onClick={() => toggleVisibility("mean")}>
              의미
            </button>
            <button className="w-[180px] h-[45px] font-bold border-2 border-nihonred rounded-lg" onClick={() => toggleVisibility("furigana")}>
              히라가나
            </button>
            <button className="w-[180px] h-[45px] bg-red-400 text-white font-bold rounded-lg" onClick={handleNextWord}>
              →
            </button>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <Modal isOpen={isModalOpen} onRestart={restartLearning} />
    </div>
  );
}
