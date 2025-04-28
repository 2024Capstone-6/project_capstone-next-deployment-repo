"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import Searchbar from "../Searchbar";

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

interface GrammarLayoutProps {
  grammars: Grammar[];
  onRestart: () => void;
}

export default function GrammarLayout({ grammars, onRestart }: GrammarLayoutProps) {
  const [grammarList, setGrammarList] = useState<Grammar[]>(grammars);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [explanationVisible, setExplanationVisible] = useState(false);
  const [visibility, setVisibility] = useState({
    mean: false,
    workbook: false,
  });

  const initializeState = () => {
    setGrammarList(grammars);
    setCurrentIndex(0);
    setIsModalOpen(false);
    setExplanationVisible(false);
    setVisibility({ mean: false, workbook: false });
  };

  useEffect(() => {
    if (grammars.length > 0) initializeState();
  }, [grammars]);

  const handleSelectGrammar = (selectedGrammarId: number) => {
    setGrammarList((prev) => {
      const newList = [...prev];
      const current = currentIndex;
      const selectedIdx = newList.findIndex((g) => g.grammar_id === selectedGrammarId);
      if (selectedIdx === -1 || current === selectedIdx) return prev;

      const selected = newList.splice(selectedIdx, 1)[0];
      const insertIdx = selectedIdx < current ? current : current + 1;
      newList.splice(insertIdx, 0, selected);
      setCurrentIndex(insertIdx);
      return newList;
    });

    setExplanationVisible(false);
    setVisibility({ mean: false, workbook: false });
  };

  const handleNext = () => {
    if (currentIndex < grammarList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setExplanationVisible(false);
      setVisibility({ mean: false, workbook: false });
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="w-full min-h-screen overflow-auto flex justify-center px-4 py-6 xl:pt-12">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        {/* 검색창 */}
        <div className="w-full max-w-[800px] mb-6">
          <Searchbar
            searchItems={grammarList.map((g) => ({
              id: g.grammar_id,
              mainText: g.grammar,
              furigana: g.grammar_furigana,
              meaning: g.grammar_meaning,
            }))}
            onSelectItem={handleSelectGrammar}
          />
        </div>

        {/* 카드 영역 */}
        <div className="relative w-full max-w-[800px] flex flex-col items-center">
          <div className="w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] rounded-lg flex flex-col items-center justify-center border-2 border-nihonred relative px-4 py-6">
            <button
              className="absolute right-4 top-4"
              onClick={() => setVisibility((prev) => ({ ...prev, workbook: !prev.workbook }))}
            >
              <Image src="/bookmark/bookmark.png" alt="bookmark" width={30} height={30} unoptimized />
            </button>

            {grammarList.length > 0 && grammarList[currentIndex] && (
              !explanationVisible ? (
                <>
                  <p className="text-nihonred text-5xl sm:text-6xl md:text-7xl font-bold">{grammarList[currentIndex].grammar}</p>
                  {visibility.mean && (
                    <p className="text-black text-2xl sm:text-3xl md:text-4xl font-semibold pt-3">{grammarList[currentIndex].grammar_meaning}</p>
                  )}
                  <p className="text-black text-lg sm:text-xl md:text-2xl font-semibold pt-7 pl-5">
                    {grammarList[currentIndex].grammar_example}
                  </p>
                  {visibility.mean && (
                    <p className="text-black text-lg sm:text-xl font-semibold pt-3">
                      {grammarList[currentIndex].grammar_e_meaning}
                    </p>
                  )}
                </>
              ) : (
                <div className="w-full h-full p-6 flex flex-col items-start justify-center">
                  <div className="flex items-center space-x-3">
                    <p className="text-nihonred text-4xl sm:text-5xl font-bold">{grammarList[currentIndex].grammar}</p>
                    <p className="text-nihonred text-3xl sm:text-4xl">{grammarList[currentIndex].grammar_furigana}</p>
                  </div>
                  <p className="text-black text-2xl sm:text-3xl font-semibold mt-3">{grammarList[currentIndex].grammar_meaning}</p>
                  <div className="mt-3">
                    {grammarList[currentIndex].grammar_s_card.map((s, i) => (
                      <p key={i} className="text-gray-700 text-base sm:text-lg mt-2">{s}</p>
                    ))}
                  </div>
                  <div className="mt-3">
                    {grammarList[currentIndex].grammar_e_card.map((e, i) => (
                      <p key={i} className="text-black text-lg sm:text-2xl font-semibold mt-2">{e}</p>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {visibility.workbook && (
            <div className="absolute right-[-170px] top-0 w-[160px] h-[120px] rounded-lg p-2 flex items-center justify-center border-2 border-nihonred">
              <p>단어장 추가 박스</p>
            </div>
          )}

          <div className="flex flex-wrap justify-between w-full mt-4 gap-2 sm:gap-4">
            <button className="flex-1 min-w-[120px] h-[45px] text-sm sm:text-base border-2 border-nihonred rounded-lg font-bold">한번 더</button>
            <button
              className="flex-1 min-w-[120px] h-[45px] text-sm sm:text-base bg-nihonred text-white font-bold rounded-lg"
              disabled={explanationVisible}
              onClick={() => setVisibility((prev) => ({ ...prev, mean: !prev.mean }))}
            >
              의미
            </button>
            <button
              className="flex-1 min-w-[120px] h-[45px] text-sm sm:text-base border-2 border-nihonred rounded-lg font-bold"
              onClick={() => setExplanationVisible((prev) => !prev)}
            >
              설명
            </button>
            <button
              className="flex-1 min-w-[120px] h-[45px] text-sm sm:text-base bg-nihonred text-white font-bold rounded-lg"
              onClick={handleNext}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onRestart={onRestart} />
    </div>
  );
}
