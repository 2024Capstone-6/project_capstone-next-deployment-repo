"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ConfirmExitModal from "../FeedbackModal";

export default function ChatHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const situationName = searchParams.get("situation_name");

  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = React.useState(false);
  const [feedbackText, setFeedbackText] = React.useState("");

  const isFreeTalkPage = pathname.includes("freeTalk");

  const handleRequestFeedback = async () => {
    try {
      const res = await fetch("http://localhost:4000/chatbot/feedback", {
        method: "POST",
      });
      const data = await res.json();
      setFeedbackText(data.feedback);
      setShowFeedbackModal(true);
    } catch (err) {
      console.error("피드백 요청 실패:", err);
    }
  };

  const closeFeedbackAndReturn = () => {
    setShowFeedbackModal(false);
    router.push("/dashboard/conversation");
  };

  return (
    <div className="w-full h-[60px] flex justify-between items-center px-4 sm:px-6 border-b border-nihonred relative">
      <button
        className="text-sm sm:text-base font-bold text-gray-700 hover:text-nihonred"
        onClick={() => router.back()}
      >
        ← 뒤로 가기
      </button>

      {situationName && (
        <div className="absolute left-1/2 transform -translate-x-1/2 text-sm sm:text-lg font-semibold text-gray-800 truncate max-w-[60%] text-center">
          {situationName}
        </div>
      )}

      {!isFreeTalkPage ? (
        <button
          className="px-4 py-2 text-sm sm:text-base bg-nihonred text-white font-semibold rounded-lg hover:bg-red-500 transition-all"
          onClick={() => {
            const current = searchParams.get("situation_name");
            router.push(`./freeTalk${current ? `?situation_name=${current}` : ""}`);
          }}
        >
          실전 회화
        </button>
      ) : (
        <button
          className="px-4 py-2 text-sm sm:text-base bg-nihonred text-white font-semibold rounded-lg hover:bg-red-500 transition-all"
          onClick={() => setShowConfirmModal(true)}
        >
          피드백 및 종료
        </button>
      )}

      {showConfirmModal && (
        <ConfirmExitModal
          onContinue={() => setShowConfirmModal(false)}
          onExit={() => {
            setShowConfirmModal(false);
            handleRequestFeedback();
          }}
        />
      )}

      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-xl max-w-[600px] w-full p-6 shadow-lg">
            <button
              onClick={closeFeedbackAndReturn}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-lg font-bold"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-nihonred mb-4">회화 피드백</h2>
            <div className="max-h-[300px] overflow-y-auto text-gray-800 whitespace-pre-wrap leading-relaxed border border-red-200 rounded-lg p-4 bg-gray-50">
              {feedbackText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
