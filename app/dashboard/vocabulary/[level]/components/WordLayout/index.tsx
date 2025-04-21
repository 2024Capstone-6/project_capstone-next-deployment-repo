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

interface WordLayoutProps {
  words: Word[];
  onRestart: () => void;
}

export default function WordLayout({ words, onRestart }: WordLayoutProps) {
  const [wordList, setWordList] = useState<Word[]>(words);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibility, setVisibility] = useState({
    furigana: false,
    mean: false,
    workbook: false,
  });

  const resetVisibility = () => {
    setVisibility({ furigana: false, mean: false, workbook: false });
  };

  useEffect(() => {
    if (words.length > 0) {
      setWordList(words);
      setCurrentIndex(0);
      setIsModalOpen(false);
      resetVisibility();
    }
  }, [words]);

  const handleSelectWord = (selectedWordId: number) => {
    setWordList((prevWords) => {
      const newWords = [...prevWords];
      const currentWordIndex = currentIndex;
      const selectedWordIndex = newWords.findIndex((w) => w.word_id === selectedWordId);
      if (selectedWordIndex === -1 || currentWordIndex === selectedWordIndex) return prevWords;
      const selectedWord = newWords.splice(selectedWordIndex, 1)[0];
      const insertIndex = selectedWordIndex < currentWordIndex ? currentWordIndex : currentWordIndex + 1;
      newWords.splice(insertIndex, 0, selectedWord);
      setCurrentIndex(insertIndex);
      return newWords;
    });
    resetVisibility();
  };

  const handleNextWord = () => {
    if (currentIndex < wordList.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      resetVisibility();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen min-w-[1280px] w-full flex items-center justify-center px-4 sm:px-6 lg:px-12 overflow-auto">
      <div className="w-full max-w-[1000px] flex flex-col items-center justify-center">
        <Searchbar
          searchItems={wordList.map((word) => ({
            id: word.word_id,
            mainText: word.word,
            furigana: word.word_furigana,
            meaning: word.word_meaning,
          }))}
          onSelectItem={handleSelectWord}
        />

        <div className="relative flex flex-col items-center mt-4 w-full max-w-[800px]">
          <div className="min-h-[400px] sm:min-h-[500px] w-full rounded-lg flex flex-col items-center justify-center border-2 border-nihonred relative px-4 py-6">
            <button
              className="absolute right-4 top-4 bg-transparent text-red-400 text-2xl"
              onClick={() => setVisibility((prev) => ({ ...prev, workbook: !prev.workbook }))}
            >
              <Image src={"/bookmark/bookmark.png"} alt="bookmark" width={30} height={30} unoptimized />
            </button>

            {wordList.length > 0 && (
              <>
                {visibility.furigana && <p className="text-nihonred text-2xl sm:text-4xl">{wordList[currentIndex].word_furigana}</p>}
                <p className="text-nihonred text-5xl sm:text-7xl font-bold">{wordList[currentIndex].word}</p>
                {visibility.mean && <p className="text-black text-2xl sm:text-4xl font-semibold pt-3">{wordList[currentIndex].word_meaning}</p>}
              </>
            )}
          </div>

          {visibility.workbook && (
            <div className="absolute right-[-170px] top-0 w-[160px] h-[120px] rounded-lg p-2 flex items-center justify-center border-2 border-nihonred">
              <p>단어장 추가 박스</p>
            </div>
          )}

          <div className="flex flex-wrap justify-between w-full mt-3 gap-2 sm:gap-4">
            <button className="flex-1 min-w-[120px] h-[45px] text-sm sm:text-base border-2 border-nihonred rounded-lg font-bold">한번 더</button>
            <button className="flex-1 min-w-[120px] h-[45px] text-sm sm:text-base bg-red-400 text-white font-bold rounded-lg" onClick={() => setVisibility((prev) => ({ ...prev, mean: !prev.mean }))}>의미</button>
            <button className="flex-1 min-w-[120px] h-[45px] text-sm sm:text-base border-2 border-nihonred rounded-lg font-bold" onClick={() => setVisibility((prev) => ({ ...prev, furigana: !prev.furigana }))}>히라가나</button>
            <button className="flex-1 min-w-[120px] h-[45px] text-sm sm:text-base bg-red-400 text-white font-bold rounded-lg" onClick={handleNextWord}>→</button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onRestart={onRestart} />
    </div>
  );
}