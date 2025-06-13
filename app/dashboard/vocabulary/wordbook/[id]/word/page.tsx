"use client";

import { useEffect, useState, useCallback } from "react";
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

interface WordMiddle {
  word: Word;
}

interface RawWordbook {
  wordbook_id: number;
  wordbook_title: string;
  word_middle?: WordMiddle[];
}

export default function WordbookWordPage() {
  const { id } = useParams();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWordbook = useCallback(async () => {
    try {
      const res = await customFetch("words/books");
      const data: RawWordbook[] = await res.json();
      const book = data.find((b) => b.wordbook_id === Number(id));
      if (book) {
        const extracted = book.word_middle?.map((wm) => wm.word) || [];
        setWords(extracted);
      }
    } catch (e) {
      console.error("❌ 단어장 불러오기 실패:", e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWordbook();
  }, [fetchWordbook]);

  if (loading) return <div className="w-full text-center mt-20">불러오는 중...</div>;

  return (
    <WordLayout
      words={words}
      currentIndex={0}
      level={"wordbook"}
      refetch={fetchWordbook}
    />
  );
}
