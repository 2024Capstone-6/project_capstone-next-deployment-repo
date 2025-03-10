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
  onRestart: () => void;
}

export default function VocabularyLayout({ words, onRestart }: VocabularyLayoutProps) {
  const [wordList, setWordList] = useState<Word[]>(words);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibility, setVisibility] = useState({
    furigana: false,
    mean: false,
    workbook: false,
  });

  // ✅ 단어 리스트 업데이트 (초기 로딩 시 & 단어 변경 시 실행)
  useEffect(() => {
    if (words.length > 0) {
      setWordList(words);
      setCurrentIndex(0);
      setIsModalOpen(false);
      setVisibility({ furigana: false, mean: false, workbook: false });
    }
  }, [words]);

  // ✅ 연관 검색어에서 단어 선택 시 단어 이동
  const handleSelectWord = (selectedWordId: number) => {
    setWordList((prevWords) => {
      const newWords = [...prevWords];
      const currentWordIndex = currentIndex;
      const selectedWordIndex = newWords.findIndex((word) => word.word_id === selectedWordId);

      if (selectedWordIndex === -1 || currentWordIndex === selectedWordIndex) {
        return prevWords;
      }

      // 기존 단어를 10번째 뒤로 이동
      const movedWord = newWords[currentWordIndex];
      let newMoveIndex = currentWordIndex + 10;
      if (newMoveIndex >= newWords.length) {
        newMoveIndex = newWords.length - 1;
      }

      newWords.splice(currentWordIndex, 1);
      newWords.splice(newMoveIndex, 0, movedWord);

      // 선택한 단어를 현재 위치로 이동
      const selectedWord = newWords[selectedWordIndex];
      newWords.splice(selectedWordIndex, 1);
      newWords.splice(currentWordIndex, 0, selectedWord);

      return newWords;
    });

    // ✅ 의미, 히라가나, 단어장 상태 초기화
    setVisibility({ furigana: false, mean: false, workbook: false });
    setCurrentIndex(currentIndex);
  };

  // ✅ 다음 단어 보기 (마지막 단어 시 모달 띄우기)
  const handleNextWord = () => {
    if (currentIndex < wordList.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setVisibility({ furigana: false, mean: false, workbook: false }); // ✅ 상태 초기화
    } else {
      setIsModalOpen(true); // ✅ 마지막 단어일 때 모달 열기
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col items-center justify-center min-w-[980px] max-w-[980px] min-h-[680px]">
        {/* 검색창 */}
        <Searchbar searchWords={wordList} onSelectWord={handleSelectWord} />

        {/* 단어 학습 카드 */}
        <div className="relative flex flex-col items-center mt-4 w-[800px]">
          <div className="h-[500px] w-full rounded-lg flex flex-col items-center justify-center border-2 border-nihonred relative">
            <button
              className="absolute right-4 top-4 bg-transparent text-red-400 text-2xl"
              onClick={() => setVisibility((prev) => ({ ...prev, workbook: !prev.workbook }))}
            >
              <Image src={"/bookmark/bookmark.png"} alt="bookmark" width={30} height={30} unoptimized />
            </button>

            {/* ✅ 단어가 존재할 때만 렌더링하여 오류 방지 */}
            {wordList.length > 0 && (
              <>
                {visibility.furigana && <p className="text-nihonred text-4xl">{wordList[currentIndex].word_furigana}</p>}
                <p className="text-black text-7xl font-bold">{wordList[currentIndex].word}</p>
                {visibility.mean && <p className="text-nihonred text-4xl font-semibold pt-3">{wordList[currentIndex].word_meaning}</p>}
              </>
            )}
          </div>

          {/* ✅ 단어장 추가 박스 (다시 추가) */}
          {visibility.workbook && (
            <div className="absolute right-[-170px] top-0 w-[160px] h-[120px] rounded-lg p-2 flex items-center justify-center border-2 border-nihonred">
              <p>단어장 추가 박스</p>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex justify-between w-full mt-3">
            <button className="w-[180px] h-[45px] font-bold rounded-lg border-2 border-nihonred">한번 더</button>
            <button className="w-[180px] h-[45px] bg-red-400 text-white font-bold rounded-lg" onClick={() => setVisibility((prev) => ({ ...prev, mean: !prev.mean }))}>
              의미
            </button>
            <button className="w-[180px] h-[45px] font-bold border-2 border-nihonred rounded-lg" onClick={() => setVisibility((prev) => ({ ...prev, furigana: !prev.furigana }))}>
              히라가나
            </button>
            <button className="w-[180px] h-[45px] bg-red-400 text-white font-bold rounded-lg" onClick={handleNextWord}>
              →
            </button>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <Modal isOpen={isModalOpen} onRestart={onRestart} />
    </div>
  );
}
