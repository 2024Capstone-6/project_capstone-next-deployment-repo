"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import Searchbar from "../Searchbar";
import customFetch from "@/util/custom-fetch";

interface Word {
  word_id: number;
  word: string;
  word_furigana: string;
  word_meaning: string;
  word_level: string;
}

interface WordLayoutProps {
  words: Word[];
  onRestart: () => void;
  uuid: string;
}

export default function WordLayout({ uuid, words, onRestart }: WordLayoutProps) {
  const [wordList, setWordList] = useState<Word[]>(words);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibility, setVisibility] = useState({
    furigana: false,
    mean: false,
    workbook: false,
  });

  // 단어 리스트 업데이트 (초기 로딩 시 & 단어 변경 시 실행)
  useEffect(() => {
    if (words.length > 0) {
      setWordList(words);
      setCurrentIndex(0);
      setIsModalOpen(false);
      setVisibility({ furigana: false, mean: false, workbook: false });
    }
  }, [words]);

  // ✅ "한번 더" 버튼 핸들러
  const handleRetry = async () => {
    setWordList(prev => {
      const newList = [...prev];
      const [currentWord] = newList.splice(currentIndex, 1);
      
      // 10번째 뒤로 이동
      const insertPosition = Math.min(currentIndex + 10, newList.length);
      newList.splice(insertPosition, 0, currentWord);
  
      // 저장 API 호출
      customFetch("/user-words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: uuid,
          shuffled_word_ids: newList.map(w => w.word_id)
        })
      }).catch(error => {
        console.error("Failed to save:", error);
      });
  
      return newList;
    });
  };

  // 검색 시 선택한 단어를 현재 위치로 이동하고 기존 단어를 뒤로 보냄 (즉시 반영)
  const handleSelectWord = (selectedWordId: number) => {
  
    setWordList((prevWords) => {
      const newWords = [...prevWords];
      const currentWordIndex = currentIndex;
      const selectedWordIndex = newWords.findIndex((w) => w.word_id === selectedWordId);
  
      if (selectedWordIndex === -1 || currentWordIndex === selectedWordIndex) {
        return prevWords;
      }
  
      // 선택한 문법을 배열에서 제거
      const selectedWord = newWords.splice(selectedWordIndex, 1)[0];
  
      // 현재 문법이 앞에 있는 문법인지 확인
      const isPastWord = selectedWordIndex < currentWordIndex;
  
      // 기존 문법이 뒤로 밀리지 않도록, 기존 위치에 정확히 삽입
      const newInsertIndex = isPastWord ? currentWordIndex : currentWordIndex + 1;
      newWords.splice(newInsertIndex, 0, selectedWord);
  
      // 선택한 문법을 학습 카드에 즉시 반영 (강제 적용)
      setCurrentIndex(newInsertIndex);
  
      return newWords;
    });
  
    // 🔹 선택한 문법이 즉시 학습 카드에 반영되도록 설정
    setVisibility({ furigana: false, mean: false, workbook: false });
  };

  // 다음 단어 보기 (마지막 단어 시 모달 띄우기)
  const handleNextWord = () => {
    if (currentIndex < wordList.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setVisibility({ furigana: false, mean: false, workbook: false }); // 상태 초기화
    } else {
      setIsModalOpen(true); // 마지막 단어일 때 모달 열기
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col items-center justify-center min-w-[980px] max-w-[980px] min-h-[680px]">
        {/* 검색창 */}
        <Searchbar
          searchItems={wordList.map((word) => ({
            id: word.word_id,
            mainText: word.word,
            furigana: word.word_furigana,
            meaning: word.word_meaning,
          }))}
          onSelectItem={handleSelectWord}
        />


        {/* 단어 학습 카드 */}
        <div className="relative flex flex-col items-center mt-4 w-[800px]">
          <div className="h-[500px] w-full rounded-lg flex flex-col items-center justify-center border-2 border-nihonred relative">
            <button
              className="absolute right-4 top-4 bg-transparent text-red-400 text-2xl"
              onClick={() => setVisibility((prev) => ({ ...prev, workbook: !prev.workbook }))}
            >
              <Image src={"/bookmark/bookmark.png"} alt="bookmark" width={30} height={30} unoptimized />
            </button>

            {/* 단어가 존재할 때만 렌더링하여 오류 방지 */}
            {wordList.length > 0 && (
              <>
                {visibility.furigana && <p className="text-nihonred text-4xl">{wordList[currentIndex].word_furigana}</p>}
                <p className="text-nihonred text-7xl font-bold">{wordList[currentIndex].word}</p>
                {visibility.mean && <p className="text-black text-4xl font-semibold pt-3">{wordList[currentIndex].word_meaning}</p>}
              </>
            )}
          </div>

          {/* 단어장 추가 박스 (다시 추가) */}
          {visibility.workbook && (
            <div className="absolute right-[-170px] top-0 w-[160px] h-[120px] rounded-lg p-2 flex items-center justify-center border-2 border-nihonred">
              <p>단어장 추가 박스</p>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex justify-between w-full mt-3">
            <button className="w-[180px] h-[45px] font-bold rounded-lg border-2 border-nihonred" onClick={handleRetry}>한번 더</button>
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