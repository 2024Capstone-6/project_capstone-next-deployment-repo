"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import WordLayout from "../../../[level]/components/WordLayout";
import customFetch from "@/util/custom-fetch";

interface Word {
  word_id: number;
  word: string;
  word_furigana: string;
  word_meaning: string;
  word_level: string;
}

export default function WordbookWordPage() {
  const { id } = useParams();
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    const fetchWordbook = async () => {
      try {
        const res = await customFetch("words/books");
        const data = await res.json();
        const book = data.find((b: any) => b.wordbook_id === Number(id));
        if (book) {
          const extracted = book.word_middle?.map((wm: any) => wm.word) || [];
          setWords(extracted);
        }
      } catch (e) {
        console.error("❌ 단어장 불러오기 실패:", e);
      }
    };
    fetchWordbook();
  }, [id]);

  const shuffleArray = (arr: Word[]) => arr.sort(() => Math.random() - 0.5);
  const restartLearning = () => setWords(shuffleArray([...words]));

  return <WordLayout words={words} onRestart={restartLearning} />;
}