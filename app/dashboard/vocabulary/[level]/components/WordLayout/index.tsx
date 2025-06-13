"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import Searchbar from "../Searchbar";
import WordbookListInLearner from "../WordbookListInLearner";
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
  currentIndex: number;
  level: string;
  refetch: () => void;
}

export default function WordLayout({ words, currentIndex: initialIndex, level, refetch }: WordLayoutProps) {
  const [wordList, setWordList] = useState<Word[]>(words);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
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
      setCurrentIndex(initialIndex);
      setIsModalOpen(false);
      resetVisibility();
    }
  }, [words, initialIndex]);

  const saveProgress = async (index: number) => {
    try {
      await customFetch("words/save-progress", {
        method: "POST",
        body: JSON.stringify({ learning_level: level, current_index: index }),
      });
    } catch (err) {
      console.error("❌ 진도 저장 실패:", err);
    }
  };

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
      saveProgress(insertIndex);
      return newWords;
    });
    resetVisibility();
  };

  const handleNextWord = () => {
    if (currentIndex < wordList.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      saveProgress(newIndex);
      resetVisibility();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleRepeat = async () => {
    try {
      await customFetch("words/repeat-word", {
        method: "PATCH",
        body: JSON.stringify({ learning_level: level, offset: 10 }),
      });

      await refetch();

      setTimeout(() => {
        handleNextWord();
      }, 100);
    } catch (e) {
      console.error("❌ repeat-word 실패:", e);
    }
  };

  return (
    <div className="w-full min-h-screen overflow-auto flex justify-center px-4 py-6 xl:pt-12">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <div className="w-full max-w-[800px] mb-6">
          <Searchbar
            searchItems={wordList.map((word) => ({
              id: word.word_id,
              mainText: word.word,
              furigana: word.word_furigana,
              meaning: word.word_meaning,
            }))}
            onSelectItem={handleSelectWord}
          />
        </div>

        <div className="relative w-full max-w-[800px] flex flex-col items-center">
          <div className="w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] rounded-lg flex flex-col items-center justify-center border-2 border-nihonred relative px-4 py-6">
            <button
              className="absolute right-4 top-4 bg-transparent text-red-400 text-2xl"
              onClick={() => setVisibility((prev) => ({ ...prev, workbook: !prev.workbook }))}
            >
              <Image src="/bookmark/bookmark.png" alt="bookmark" width={30} height={30} unoptimized />
            </button>

            {wordList.length > 0 && (
              <>
                {visibility.furigana && <p className="text-nihonred text-2xl sm:text-4xl">{wordList[currentIndex].word_furigana}</p>}
                <p className="text-nihonred text-5xl sm:text-6xl md:text-7xl font-bold">{wordList[currentIndex].word}</p>
                {visibility.mean && <p className="text-black text-2xl sm:text-3xl md:text-4xl font-semibold pt-3">{wordList[currentIndex].word_meaning}</p>}
              </>
            )}
          </div>

          {visibility.workbook && wordList[currentIndex] && (
            <WordbookListInLearner currentId={wordList[currentIndex].word_id} type="word" />
          )}

          <div className="flex flex-wrap justify-between w-full mt-4 gap-2 sm:gap-4">
            <button className="flex-1 min-w-[120px] h-[45px] text-sm sm:text-base border-2 border-nihonred rounded-lg font-bold" onClick={handleRepeat}>한번 더</button>
            <button className="flex-1 min-w-[120px] h-[45px] text-sm sm:text-base bg-red-400 text-white font-bold rounded-lg" onClick={() => setVisibility((prev) => ({ ...prev, mean: !prev.mean }))}>의미</button>
            <button className="flex-1 min-w-[120px] h-[45px] text-sm sm:text-base border-2 border-nihonred rounded-lg font-bold" onClick={() => setVisibility((prev) => ({ ...prev, furigana: !prev.furigana }))}>히라가나</button>
            <button className="flex-1 min-w-[120px] h-[45px] text-sm sm:text-base bg-red-400 text-white font-bold rounded-lg" onClick={handleNextWord}>→</button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onRestart={refetch} level={level} />
    </div>
  );
}
