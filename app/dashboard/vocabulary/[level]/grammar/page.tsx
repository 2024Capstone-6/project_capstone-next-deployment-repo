"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import GrammarLayout from "../components/GrammarLayout";
import customFetch from "@/util/custom-fetch";

interface Grammar {
  grammar_id: number;
  grammar: string;
  grammar_furigana: string;
  grammar_meaning: string;
  grammar_level: string;
  grammar_example: string;
  grammar_e_meaning: string;
  grammar_s_card: string[];
  grammar_e_card: string[];
}

export default function GrammarPage() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const levelRaw = pathSegments[pathSegments.length - 2];
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const level = decodeURIComponent(levelRaw).replace("JLPT ", "").trim();

  const fetchGrammars = async () => {
    try {
      const res = await customFetch("/grammars");
      const data: Grammar[] = await res.json();
      const filtered = data.filter(
        (g) => g.grammar_level.trim().toUpperCase() === level.toUpperCase()
      );
      setGrammars(shuffleArray(filtered));
    } catch (e) {
      console.error("❌ 문법 불러오기 실패:", e);
    }
  };

  useEffect(() => {
    fetchGrammars();
  }, [level]);

  const shuffleArray = (arr: Grammar[]) => arr.sort(() => Math.random() - 0.5);

  const restartLearning = () => {
    setGrammars(shuffleArray([...grammars]));
  };

  return <GrammarLayout grammars={grammars} onRestart={restartLearning} />;
}
