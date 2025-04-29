"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import WordLayout from "../components/WordLayout";
import customFetch from "@/util/custom-fetch";

interface Word {
  word_id: number;
  word: string;
  word_furigana: string;
  word_meaning: string;
  word_level: string;
}

export default function WordPage() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const levelRaw = pathSegments[pathSegments.length - 2];
  const [words, setWords] = useState<Word[]>([]);
  const level = decodeURIComponent(levelRaw).replace("JLPT ", "").trim();

  const fetchWords = async () => {
    try {
      const response = await customFetch("words");
      const data: Word[] = await response.json();

      if (level) {
        const filteredWords = data.filter(
          (word) => word.word_level.trim().toUpperCase() === level.toUpperCase()
        );
        setWords(shuffleArray(filteredWords));
      }
    } catch (error) {
      console.error("❌ 단어 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchWords();
  }, [level]);

  const shuffleArray = (array: Word[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const restartLearning = () => {
    setWords(shuffleArray([...words]));
  };

  return <WordLayout words={words} onRestart={restartLearning} />;
}