"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import Searchbar from "../Searchbar";

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
  const [wordList, setWordList] = useState<Word[]>([]); // 🔹 초기값을 빈 배열로 설정
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibility, setVisibility] = useState({
    furigana: false,
    mean: false,
    workbook: false,
  });

  // ✅ 새로고침 후 words가 변경되면 wordList 업데이트
  useEffect(() => {
    if (words.length > 0) {
      setWordList(words);
    }
  }, [words]);

  // ✅ 단어가 없을 경우 렌더링을 막기 위해 예외 처리
  if (wordList.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-nihonred text-2xl">불러올 단어가 없습니다.</p>
      </div>
    );
  }

  // 현재 학습 중인 단어 가져오기
  const currentWord = wordList[currentIndex];

  // ✅ 연관 검색어에서 단어 선택 시 단어 이동 로직
  const handleSelectWord = (selectedWordId: number) => {
    setWordList((prevWords) => {
      const newWords = [...prevWords];

      const currentWordIndex = currentIndex;
      const selectedWordIndex = newWords.findIndex((word) => word.word_id === selectedWordId);

      if (selectedWordIndex === -1 || currentWordIndex === selectedWordIndex) {
        return prevWords;
      }

      const movedWord = newWords[currentWordIndex];
      let newMoveIndex = currentWordIndex + 10;
      if (newMoveIndex >= newWords.length) {
        newMoveIndex = newWords.length - 1;
      }

      newWords.splice(currentWordIndex, 1);
      newWords.splice(newMoveIndex, 0, movedWord);

      const selectedWord = newWords[selectedWordIndex];
      newWords.splice(selectedWordIndex, 1);
      newWords.splice(currentWordIndex, 0, selectedWord);

      return newWords;
    });

    setCurrentIndex(currentIndex);
  };

  // 단어장 추가 버튼
  const toggleVisibility = (key: "furigana" | "mean" | "workbook") => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 다음 단어 보기
  const handleNextWord = () => {
    if (currentIndex < wordList.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setVisibility({ furigana: false, mean: false, workbook: false });
    } else {
      setIsModalOpen(true);
    }
  };

  // 다시 학습 버튼 클릭 시 초기화
  const restartLearning = () => {
    setCurrentIndex(0);
    setVisibility({ furigana: false, mean: false, workbook: false });
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col items-center justify-center min-w-[980px] max-w-[980px] min-h-[680px]">
        {/* 검색창 영역 */}
        <Searchbar searchWords={wordList} onSelectWord={handleSelectWord} />

        {/* 단어 학습 카드 */}
        <div className="relative flex flex-col items-center mt-4 w-[800px]">
          <div className="h-[500px] w-full rounded-lg flex flex-col items-center justify-center border-2 border-nihonred relative">
            <button className="absolute right-4 top-4 bg-transparent text-red-400 text-2xl" onClick={() => toggleVisibility("workbook")}>
              <Image src={"/bookmark/bookmark.png"} alt="bookmark" width={30} height={30} unoptimized />
            </button>
            {visibility.furigana && <p className="text-nihonred text-4xl">{currentWord.word_furigana}</p>}
            <p className="text-black text-7xl font-bold">{currentWord.word}</p>
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
