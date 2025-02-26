"use client";
import React from "react";
import CertificateCard from "@/app/components/CertificateCard";

interface Certificate {
  category: string;
  levels: string[];
}

const certificates: Certificate[] = [
  { category: "JLPT", levels: ["JLPT N1", "JLPT N2", "JLPT N3", "JLPT N4", "JLPT N5"] },
  { category: "JPT", levels: ["JPT 950", "JPT 850", "JPT 750", "JPT 650", "JPT 550"] },
  { category: "BJT", levels: ["BJT J1+", "BJT J1", "BJT J2", "BJT J3", "BJT J4"] },
];

export default function VocabularyPage() {
  return (
      <div className="flex h-screen gap-4">
        {/* 본문 영역 */}
        <div className="flex-1 flex flex-col min-w-[970px] max-w-[970px] min-h-[680px] rounded-lg m-6 mr-0">
          {/* 예비 */}
          <div className="h-[60px] bg-gray-300 rounded-lg flex items-center justify-center">
            <p>예비</p>
          </div>

          {/* 본문 */}
          <div className="flex-1 mt-2 rounded-lg p-6 overflow-auto">
            <div className="flex-1 pt-4 pl-28 justify-center">
              {certificates.map((certificate, index) => (
                <div key={index} className="mb-8">
                  {/* 자격증 이름 */}
                  <h2 className="text-lg font-bold mb-2">{certificate.category}</h2>
                  {/* 자격증 단계계 */}
                  <div className="flex gap-4">
                    {certificate.levels.map((level, idx) => (
                      <CertificateCard 
                      key={idx} 
                      level={level} 
                      wordPath={`/dashboard/vocabulary/${level}/word`} 
                      grammarPath={`/dashboard/vocabulary/${level}/grammar`} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 학습 진도 및 단어장 영역 */}
        <div className="xl:flex hidden flex-col min-w-[235px] rounded-lg mt-6 mb-6 mr-6">
          {/* 학습 진도 */}
          <div className="h-[150px] bg-gray-400 rounded-lg flex items-center justify-center">
            <p>학습 진도 공간</p>
          </div>

          {/* 단어장 목록 */}
          <div className="flex-1 mt-4 rounded-lg p-6 overflow-auto border-2 border-nihonred">
            <p>단어장 공간</p>
          </div>
        </div>
      </div>
  );
}