"use client";
import React from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";

interface Situation {
  situation_id: number;
  situation_name: string;
  category_id: number;
}

interface SituationListProps {
  categoryId: number;
  isVisible: boolean;
  situations: Situation[];
}

export default function SituationList({ categoryId, isVisible, situations }: SituationListProps) {
  const router = useRouter();

  const handleClick = (situation: Situation) => {
    router.push(
      `/dashboard/conversation/${categoryId}/${situation.situation_id}/practice?situation_name=${encodeURIComponent(
        situation.situation_name
      )}`
    );
  };

  return (
    <div
      className={classNames(
        "w-full flex flex-wrap justify-start items-start gap-3 p-4 transition-all duration-300",
        isVisible
          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          : "opacity-0 scale-90 translate-y-4 pointer-events-none"
      )}
    >
      {situations.map((situation) => (
        <div
          key={situation.situation_id}
          onClick={() => handleClick(situation)}
          className="px-4 py-2 bg-white text-gray-900 text-lg font-medium rounded-md shadow-md hover:bg-gray-200 cursor-pointer transition-all"
        >
          {situation.situation_name}
        </div>
      ))}
    </div>
  );
}
