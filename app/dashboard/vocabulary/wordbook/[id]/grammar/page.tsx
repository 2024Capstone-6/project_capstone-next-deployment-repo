"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GrammarLayout from "../../../[level]/components/GrammarLayout";
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

interface GrammarMiddle {
  grammar: Grammar;
}

interface RawGrammarbook {
  grammarbook_id: number;
  grammarbook_title: string;
  grammar_middle?: GrammarMiddle[];
}

export default function WordbookGrammarPage() {
  const { id } = useParams();
  const [grammars, setGrammars] = useState<Grammar[]>([]);

  useEffect(() => {
    const fetchGrammarbook = async () => {
      try {
        const res = await customFetch("grammars/books");
        const data: RawGrammarbook[] = await res.json();
        const book = data.find((b) => b.grammarbook_id === Number(id));
        if (book) {
          const extracted = book.grammar_middle?.map((gm) => gm.grammar) || [];
          setGrammars(extracted);
        }
      } catch (e) {
        console.error("❌ 문법장 불러오기 실패:", e);
      }
    };
    fetchGrammarbook();
  }, [id]);

  const shuffleArray = (arr: Grammar[]) => arr.sort(() => Math.random() - 0.5);
  const restartLearning = () => setGrammars(shuffleArray([...grammars]));

  return <GrammarLayout grammars={grammars} onRestart={restartLearning} />;
}
