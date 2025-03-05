"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import VocabularyLayout from "../components/VocabularyLayout";

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

  // 마지막 단어에서 랜덤 셔플이 안되는 듯함
  useEffect(() => {
    const fetchWords = async () => {
      try {
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
  
    fetchWords();
  }, [level]);

  const shuffleArray = (array: Word[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  return <VocabularyLayout words={words} />;
}
