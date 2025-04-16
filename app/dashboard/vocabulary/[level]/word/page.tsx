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

  // ✅ 단어 불러오기 + 랜덤 셔플
  const fetchWords = async () => {
    try {
      // const res = await customFetch('/words')
      const response = await fetch("http://localhost:4000/words");
      const data: Word[] = await response.json();

      if (level) {
        const filteredWords = data.filter(
          (word) => word.word_level.trim().toUpperCase() === level.toUpperCase()
        );
        setWords(shuffleArray(filteredWords));
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchWords();
  }, [level]);

  const shuffleArray = (array: Word[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // ✅ "다시 학습" 버튼 클릭 시 새로 셔플
  const restartLearning = () => {
    setWords(shuffleArray([...words])); // 🔹 기존 단어를 다시 섞음
  };

  return <WordLayout words={words} onRestart={restartLearning} />;
}
