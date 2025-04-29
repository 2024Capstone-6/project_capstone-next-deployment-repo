"use client";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import ChatBubble from "../ChatBubble";
import ChatOptions from "../ChatOptions";
import ChatWindowLayout from "./ChatWindowLayout";
import { useScenario } from "@/app/hooks/useScenario";
import customFetch from "@/util/custom-fetch";

export default function ChatWindow() {
  const { situation } = useParams();
  const scenarioId = Number(situation);
  const scenario = useScenario(scenarioId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredMap, setAnsweredMap] = useState<{
    [key: number]: { selected: string; correct: boolean; feedback: string };
  }>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const showOptions = scenario && currentIndex < scenario.length;
  const isFinished = scenario && currentIndex >= scenario.length;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 5;
      setIsAtBottom(isBottom);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [currentIndex, answeredMap]);

  const handleAnswer = async (selectedChoice: string) => {
    if (!scenario) return;
    const orderIndex = scenario[currentIndex].order_index;

    try {
      const res = await customFetch(
        `chatbot/check-answer/${situation}/${orderIndex}`,
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