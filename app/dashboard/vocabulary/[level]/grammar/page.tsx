"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import GrammarLayout from "../components/GrammarLayout";

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

  // ✅ 단어 불러오기 + 랜덤 셔플
  const fetchGrammars = async () => {
    try {
      const response = await fetch("http://localhost:4000/grammars");
      const data: Grammar[] = await response.json();

      if (level) {
        const filteredGrammars = data.filter(
          (grammar) => grammar.grammar_level.trim().toUpperCase() === level.toUpperCase()
        );
        setGrammars(shuffleArray(filteredGrammars));
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchGrammars();
  }, [level]);

  const shuffleArray = (array: Grammar[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // ✅ "다시 학습" 버튼 클릭 시 새로 셔플
  const restartLearning = () => {
    setGrammars(shuffleArray([...grammars])); // 🔹 기존 단어를 다시 섞음
  };

  return <GrammarLayout grammars={grammars} onRestart={restartLearning} />;
}
