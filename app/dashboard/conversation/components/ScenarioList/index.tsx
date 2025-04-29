"use client";

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import SituationList from "../SituationList";
import customFetch from "@/util/custom-fetch";

interface Situation {
  situation_id: number;
  situation_name: string;
  category_id: number;
}

interface Category {
  category_id: number;
  category_name: string;
  situations: Situation[];
}

export default function ScenarioList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await customFetch("chatbot/categories-with-situations");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className="w-full flex flex-col items-center"
      onMouseLeave={() => setHoveredCategory(null)}
    >
      <div className="w-full flex flex-col space-y-6">
        {categories.map((category) => (
          <div
            key={category.category_id}
            onMouseEnter={() => setHoveredCategory(category.category_id)}
            className={classNames(
              "relative w-full text-xl sm:text-2xl md:text-3xl font-semibold text-white rounded-lg transition-all ease-in-out duration-300 flex flex-col items-start justify-start",
              "bg-gradient-to-b from-[#FF6B6B] via-[#FF6E6E] to-[#FF8E8E]",
              "shadow-sm shadow-red-300",
              "before:content-[''] before:absolute before:inset-0 before:rounded-lg before:shadow-inner before:shadow-white/10",
              hoveredCategory === category.category_id ? "h-[200px]" : "h-[80px]"
            )}
          >
            <span
              className={classNames(
                "absolute left-1/2 top-5 transform -translate-x-1/2 transition-all duration-500 ease-in-out",
                hoveredCategory === category.category_id
                  ? "opacity-0 scale-95 translate-y-[-10px]"
                  : "opacity-100 scale-100 translate-y-0"
              )}
            >
              {category.category_name}
            </span>

            <SituationList
              categoryId={category.category_id}
              isVisible={hoveredCategory === category.category_id}
              situations={category.situations}
            />
          </div>
        ))}
      </div>
    </div>
  );
}