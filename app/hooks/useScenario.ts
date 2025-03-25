"use client";
import { useEffect, useState } from "react";

interface Choice {
  text: string;
  reason: string;
  is_correct: boolean;
}

export interface Question {
  qna_id: number;
  chatbot_question: string;
  kr_answer: string;
  blank_answer: string;
  order_index: number;
  choices: Choice[];
}

export function useScenario(situationId: number) {
  const [questions, setQuestions] = useState<Question[] | null>(null);

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const res = await fetch(`http://localhost:4000/chatbot/questions/${situationId}`);
        const data: Question[] = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error("시나리오 질문 불러오기 실패:", error);
        setQuestions(null);
      }
    };

    if (situationId) fetchScenario();
  }, [situationId]);

  return questions;
}
