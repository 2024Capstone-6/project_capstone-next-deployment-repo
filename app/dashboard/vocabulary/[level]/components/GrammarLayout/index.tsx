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
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col ml-32 items-center justify-center min-w-[980px] max-w-[980px] min-h-[680px]">
        <Searchbar
          searchItems={grammarList.map((g) => ({
            id: g.grammar_id,
            mainText: g.grammar,
            furigana: g.grammar_furigana,
            meaning: g.grammar_meaning,
          }))}
          onSelectItem={handleSelectGrammar}
        />

        <div className="relative flex flex-col items-center mt-4 w-[800px]">
          <div className="h-[500px] w-full rounded-lg flex flex-col items-center justify-center border-2 border-nihonred relative px-6 py-4">
            <button
              className="absolute right-4 top-4"
              onClick={() => setVisibility((prev) => ({ ...prev, workbook: !prev.workbook }))}
            >
              <Image src={"/bookmark/bookmark.png"} alt="bookmark" width={30} height={30} unoptimized />
            </button>

            {grammarList.length > 0 && grammarList[currentIndex] && (
              !explanationVisible ? (
                <>
                  <p className="text-nihonred text-7xl font-bold">{grammarList[currentIndex].grammar}</p>
                  {visibility.mean && (
                    <p className="text-black text-3xl font-semibold pt-3">{grammarList[currentIndex].grammar_meaning}</p>
                  )}
                  <p className="text-black text-2xl font-semibold pt-7 pl-5">
                    {grammarList[currentIndex].grammar_example}
                  </p>
                  {visibility.mean && (
                    <p className="text-black text-xl font-semibold pt-3">
                      {grammarList[currentIndex].grammar_e_meaning}
                    </p>
                  )}
                </>
              ) : (
                <div className="w-full h-full p-6 flex flex-col items-start justify-center">
                  <div className="flex items-center space-x-3">
                    <p className="text-nihonred text-5xl font-bold">{grammarList[currentIndex].grammar}</p>
                    <p className="text-nihonred text-4xl">{grammarList[currentIndex].grammar_furigana}</p>
                  </div>
                  <p className="text-black text-3xl font-semibold mt-3">{grammarList[currentIndex].grammar_meaning}</p>
                  <div className="mt-3">
                    {grammarList[currentIndex].grammar_s_card.map((s, i) => (
                      <p key={i} className="text-gray-700 text-lg mt-2">{s}</p>
                    ))}
                  </div>
                  <div className="mt-3">
                    {grammarList[currentIndex].grammar_e_card.map((e, i) => (
                      <p key={i} className="text-black text-2xl font-semibold mt-2">{e}</p>
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

          <div className="flex justify-between w-full mt-3">
            <button className="w-[180px] h-[45px] font-bold border-2 border-nihonred rounded-lg">한번 더</button>
            <button
              className="w-[180px] h-[45px] bg-nihonred text-white font-bold rounded-lg"
              disabled={explanationVisible}
              onClick={() => setVisibility((prev) => ({ ...prev, mean: !prev.mean }))}
            >
              의미
            </button>
            <button
              className="w-[180px] h-[45px] font-bold border-2 border-nihonred rounded-lg"
              onClick={() => setExplanationVisible((prev) => !prev)}
            >
              설명
            </button>
            <button
              className="w-[180px] h-[45px] bg-nihonred text-white font-bold rounded-lg"
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
