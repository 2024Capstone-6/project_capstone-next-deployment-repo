"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function WordPage() {
  const router = useRouter();

  const dummyWords = [
    { index: 0, word: "即ち", furigana: "すなわち", mean: "즉" },
    { index: 1, word: "勉強", furigana: "べんきょう", mean: "공부" },
    { index: 2, word: "楽しい", furigana: "たのしい", mean: "즐겁다" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [visibility, setVisibility] = useState({
    furigana: false,
    mean: false,
    workbook: false,
  });

  const toggleVisibility = (key: "furigana" | "mean" | "workbook") => {
    setVisibility((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNextWord = () => {
    if (currentIndex < dummyWords.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setVisibility({ furigana: false, mean: false, workbook: false });
    } else {
      setIsModalOpen(true); // 마지막 단어에서 모달 열기
    }
  };

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
            {visibility.furigana && (
              <p className="text-nihonred text-3xl">{dummyWords[currentIndex].furigana}</p>
            )}
            <p className="text-black text-8xl font-bold">{dummyWords[currentIndex].word}</p>
            {visibility.mean && (
              <p className="text-nihonred text-3xl font-semibold pt-3">{dummyWords[currentIndex].mean}</p>
            )}
          </div>

          {/* 단어장 추가 박스 */}
          {visibility.workbook && (
            <div className="absolute right-[-170px] top-0 w-[160px] h-[120px] rounded-lg p-2 flex items-center justify-center border-2 border-nihonred">
              <p>단어장 추가 박스</p>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex justify-between w-full mt-3">
            <button className="w-[180px] h-[45px] font-bold rounded-lg border-2 border-nihonred">
              한번 더
            </button>
            <button className="w-[180px] h-[45px] bg-red-400 text-white font-bold rounded-lg"
              onClick={() => toggleVisibility("mean")}>
              의미
            </button>
            <button className="w-[180px] h-[45px] font-bold border-2 border-nihonred rounded-lg"
              onClick={() => toggleVisibility("furigana")}>
              히라가나
            </button>
            <button className="w-[180px] h-[45px] bg-red-400 text-white font-bold rounded-lg"
              onClick={handleNextWord}>
              →
            </button>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">학습이 끝났습니다.</p>
            <div className="flex justify-center gap-4">
              <button className="px-6 py-2 bg-red-400 text-white rounded-lg font-bold" onClick={restartLearning}>
                다시 학습
              </button>
              <button className="px-6 py-2 bg-gray-300 rounded-lg font-bold" onClick={() => router.push("/vocabulary")}>
                메인으로
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
