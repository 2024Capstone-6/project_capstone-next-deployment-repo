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

  // 학습 카드 변경 시 초기화
  useEffect(() => {
    if (grammars.length > 0) {
      setGrammarList(grammars);
      setCurrentIndex(0);
      setIsModalOpen(false);
      setExplanationVisible(false);
      setVisibility({ mean: false, workbook: false });
    }
  }, [grammars]);

  // 검색 시 선택한 단어를 현재 위치로 이동하고 기존 단어를 뒤로 보냄 (즉시 반영)
  const handleSelectGrammar = (selectedGrammarId: number) => {
  
    setGrammarList((prevGrammars) => {
      const newGrammars = [...prevGrammars];
      const currentGrammarIndex = currentIndex;
      const selectedGrammarIndex = newGrammars.findIndex((g) => g.grammar_id === selectedGrammarId);
  
      if (selectedGrammarIndex === -1 || currentGrammarIndex === selectedGrammarIndex) {
        return prevGrammars;
      }
  
      // 선택한 문법을 배열에서 제거
      const selectedGrammar = newGrammars.splice(selectedGrammarIndex, 1)[0];
  
      // 현재 문법이 앞에 있는 문법인지 확인
      const isPastGrammar = selectedGrammarIndex < currentGrammarIndex;
  
      // 기존 문법이 뒤로 밀리지 않도록, 기존 위치에 정확히 삽입
      const newInsertIndex = isPastGrammar ? currentGrammarIndex : currentGrammarIndex + 1;
      newGrammars.splice(newInsertIndex, 0, selectedGrammar);
  
      // 선택한 문법을 학습 카드에 즉시 반영 (강제 적용)
      setCurrentIndex(newInsertIndex);
  
      return newGrammars;
    });
  
    // 🔹 선택한 문법이 즉시 학습 카드에 반영되도록 설정
    setExplanationVisible(false);
    setVisibility({ mean: false, workbook: false });
  };

  // 다음 단어 보기 (마지막 단어 시 모달 띄우기)
  const handleNextGrammar = () => {
    console.log("➡ 다음 문법 보기 실행됨");

    if (currentIndex < grammarList.length - 1) {
      console.log("📌 현재 인덱스 증가:", currentIndex + 1);
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setExplanationVisible(false);
      setVisibility({ mean: false, workbook: false });
    } else {
      console.log("마지막 문법 도달, 모달 오픈");
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col items-center justify-center min-w-[980px] max-w-[980px] min-h-[680px]">
        {/* 검색창 */}
        <Searchbar
          searchItems={grammarList.map((grammar) => ({
            id: grammar.grammar_id,
            mainText: grammar.grammar,
            furigana: grammar.grammar_furigana,
            meaning: grammar.grammar_meaning,
          }))}
          onSelectItem={handleSelectGrammar}
        />

        {/* 학습 카드 */}
        <div className="relative flex flex-col items-center mt-4 w-[800px]">
          <div className="h-[500px] w-full rounded-lg flex flex-col items-center justify-center border-2 border-nihonred relative px-6 py-4">
            <button
              className="absolute right-4 top-4 bg-transparent text-red-400 text-2xl"
              onClick={() => setVisibility((prev) => ({ ...prev, workbook: !prev.workbook }))}
            >
              <Image src={"/bookmark/bookmark.png"} alt="bookmark" width={30} height={30} unoptimized />
            </button>

            {/* 기본 학습 카드 (설명 OFF) */}
            {grammarList.length > 0 && grammarList[currentIndex] && (
              !explanationVisible ? (
                <>
                  <p className="text-nihonred text-7xl font-bold">{grammarList[currentIndex].grammar}</p>
                  {visibility.mean && (
                    <p className="text-black text-3xl font-semibold pt-3">{grammarList[currentIndex].grammar_meaning}</p>
                  )}
                  <p className="text-black text-2xl font-semibold pt-7 pl-5">{grammarList[currentIndex].grammar_example}</p>
                  {visibility.mean && (
                    <p className="text-black text-xl font-semibold pt-3">{grammarList[currentIndex].grammar_e_meaning}</p>
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
                    {grammarList[currentIndex].grammar_s_card.map((sentence, idx) => (
                      <p key={idx} className="text-gray-700 text-lg mt-2">{sentence}</p>
                    ))}
                  </div>
                  <div className="mt-3">
                    {grammarList[currentIndex].grammar_e_card.map((example, idx) => (
                      <p key={idx} className="text-black text-2xl font-semibold mt-2">{example}</p>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {/* 단어장 추가 박스 (다시 추가) */}
          {visibility.workbook && (
            <div className="absolute right-[-170px] top-0 w-[160px] h-[120px] rounded-lg p-2 flex items-center justify-center border-2 border-nihonred">
              <p>단어장 추가 박스</p>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex justify-between w-full mt-3">
            <button className="w-[180px] h-[45px] font-bold rounded-lg border-2 border-nihonred">
              한번 더
            </button>
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
              onClick={handleNextGrammar}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <Modal isOpen={isModalOpen} onRestart={onRestart} />
    </div>
  );
}
