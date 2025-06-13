"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import WordLayout from "../components/WordLayout";
import StartModal from "../components/StartModal";
import customFetch from "@/util/custom-fetch";

interface Word {
  word_id: number;
  word: string;
  word_furigana: string;
  word_meaning: string;
  word_level: string;
}

interface ProgressResponse {
  learning_level: string;
  current_index: number;
  words: Word[];
}

export default function WordPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pathSegments = pathname.split("/");
  const levelRaw = pathSegments[pathSegments.length - 2];
  const level = decodeURIComponent(levelRaw).trim();

  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const fetchWordsWithProgress = async () => {
    try {
      const response = await customFetch(`words/with-progress?learning_level=${encodeURIComponent(level)}`);
      const data: ProgressResponse = await response.json();
      setWords(data.words);
      setCurrentIndex(data.current_index);
    } catch (error) {
      console.error("❌ 단어 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    const isResume = searchParams.get("resume") === "true";
    if (isResume) {
      setShowModal(true);
    } else {
      fetchWordsWithProgress();
    }
  }, [level]);

  const handleStartNew = async () => {
    try {
      await customFetch(`words/reset-progress?learning_level=${encodeURIComponent(level)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("❌ 진도 리셋 실패:", err);
    }
    setShowModal(false);
    fetchWordsWithProgress();
  };

  const handleResume = () => {
    setShowModal(false);
    fetchWordsWithProgress();
  };

  return (
    <>
      {showModal && (
        <StartModal
          onStartNew={handleStartNew}
          onResume={handleResume}
        />
      )}
      {!showModal && (
        <WordLayout 
          words={words} 
          currentIndex={currentIndex} 
          level={level}
          refetch={fetchWordsWithProgress}
        />
      )}
    </>
  );
}
