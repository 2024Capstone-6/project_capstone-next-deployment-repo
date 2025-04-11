"use client";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import ChatBubble from "../ChatBubble";
import ChatOptions from "../ChatOptions";
import ChatWindowLayout from "./ChatWindowLayout";
import { useScenario } from "@/app/hooks/useScenario";

export default function ChatWindow() {
  const { situation } = useParams();
  const scenarioId = Number(situation);
  const scenario = useScenario(scenarioId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredMap, setAnsweredMap] = useState<{
    [key: number]: { selected: string; correct: boolean; feedback: string };
  }>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const showOptions = scenario && currentIndex < scenario.length;
  const isFinished = scenario && currentIndex >= scenario.length;

  const handleAnswer = async (selectedChoice: string) => {
    if (!scenario) return;
    const orderIndex = scenario[currentIndex].order_index;

    try {
      const res = await fetch(
        `http://localhost:4000/chatbot/check-answer/${situation}/${orderIndex}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selectedChoice }),
        }
      );
      const data = await res.json();

      setAnsweredMap((prev) => ({
        ...prev,
        [currentIndex]: {
          selected: selectedChoice,
          correct: data.success,
          feedback: data.explanation,
        },
      }));

      if (data.success) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
        }, 400);
      }
    } catch (err) {
      console.error("정답 확인 실패:", err);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnsweredMap({});
  };

  // 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [currentIndex, answeredMap]);

  return (
    <ChatWindowLayout
      scrollRef={scrollRef}
      chatContent={
        <>
          {scenario &&
            scenario.slice(0, currentIndex + 1).map((qna, idx) => {
              const answerData = answeredMap[idx];
              const isCorrect = answerData?.correct;
              const selected = answerData?.selected;
              const feedback = answerData?.feedback;

              return (
                <React.Fragment key={qna.qna_id}>
                  <ChatBubble
                    message={qna.jp_question}
                    jp_mean={qna.kr_question}
                    isUser={false}
                  />
                  <ChatBubble
                    message={
                      isCorrect
                        ? qna.blank_answer.replace("______", selected)
                        : qna.kr_answer
                    }
                    isUser={true}
                    feedback={isCorrect ? feedback : undefined}
                  />
                </React.Fragment>
              );
            })}

          {/* 다시 학습하기 버튼 */}
          {isFinished && (
            <div className="w-full flex justify-center">
              <button
                onClick={handleRetry}
                className="px-4 py-3 bg-nihonred text-white rounded-lg text-lg font-semibold hover:bg-red-500 transition-all"
              >
                다시 학습하기
              </button>
            </div>
          )}
        </>
      }
      optionsContent={
        showOptions ? (
          <ChatOptions
            choices={scenario![currentIndex].choices}
            blankAnswer={scenario![currentIndex].blank_answer}
            onSelect={handleAnswer}
            feedback={
              answeredMap[currentIndex] &&
              !answeredMap[currentIndex].correct
                ? answeredMap[currentIndex].feedback
                : undefined
            }
          />
        ) : undefined
      }
    />
  );
}