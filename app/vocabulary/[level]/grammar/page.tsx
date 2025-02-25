"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function WordPage() {
  const router = useRouter();

  const dummyGrammars = [
    { index: 0, word: "~恐れがある", furigana: "(~おそれがある)", mean: "“~할 우려가 있다.”, “~할 염려가 있다.”",
      example: "地震による津波の恐れがありますので、高台に避難してください。", exMean: "지진으로 인해 쓰나미가 올 우려가 있으니, 높은 곳으로 대피하세요." },
    { index: 1, word: "~べき", mean: "해야 한다.", example: "もっと努力すべきだ。", exMean: "더 노력해야 한다." },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [visibility, setVisibility] = useState({
    explanation: false,
    mean: false,
    workbook: false,
  });

  const toggleVisibility = (key: "explanation" | "mean" | "workbook") => {
    setVisibility((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNextWord = () => {
    if (currentIndex < dummyGrammars.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setVisibility({ explanation: false, mean: false, workbook: false });
    } else {
      setIsModalOpen(true); // 마지막 단어에서 모달 열기
    }
  };

  const restartLearning = () => {
    setCurrentIndex(0);
    setVisibility({ explanation: false, mean: false, workbook: false });
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
            <p className="text-nihonred text-7xl font-bold">{dummyGrammars[currentIndex].word}</p>
            <p className="text-nihonred text-7xl">{dummyGrammars[currentIndex].furigana}</p>
            {visibility.mean && (
              <p className="text-3xl font-semibold pt-4">{dummyGrammars[currentIndex].mean}</p>
            )}
            <p className="text-2xl font-semibold pt-4 pl-4">{dummyGrammars[currentIndex].example}</p>
            {visibility.mean && (
                <p className="text-xl">{dummyGrammars[currentIndex].exMean}</p>
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
              onClick={() => toggleVisibility("explanation")}>
              설명
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
