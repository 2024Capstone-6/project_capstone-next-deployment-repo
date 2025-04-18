"use client";
import React from "react";
import Link from "next/link";

interface CertificateCardProps {
  level: string;
  wordPath: string;
  grammarPath: string;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ level, wordPath, grammarPath }) => {
  return (
    <div className="relative w-32 h-28 border-2 border-red-300 rounded-xl flex items-center justify-center
                    text-center font-semibold cursor-pointer transition-all duration-300 overflow-hidden group
                    bg-white shadow-md hover:shadow-xl hover:scale-[1.05]">
      {/* 기본 상태 (자격증 단계) */}
      <span className="group-hover:hidden text-gray-800">{level}</span>

      {/* Hover 상태 (단어/문법 선택 가능) */}
      <div className="absolute inset-0 flex hidden group-hover:flex">
        {/* 단어 버튼 */}
        <Link href={wordPath} className="w-1/2 h-full bg-nihonred text-white flex items-center justify-center
                                        hover:bg-red-00 transition-all duration-200 font-semibold">
          단어
        </Link>
        {/* 문법 버튼 */}
        <Link href={grammarPath} className="w-1/2 h-full bg-white text-black flex items-center justify-center
                                           hover:bg-gray-200 transition-all duration-200 font-semibold">
          문법
        </Link>
      </div>
    </div>
  );
};

export default CertificateCard;
