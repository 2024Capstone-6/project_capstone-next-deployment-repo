"use client";
import React, { useState } from "react";
import Link from "next/link";

interface CertificateCardProps {
  level: string;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ level }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-32 h-28 border-2 border-red-300 rounded-lg flex items-center justify-center
                text-center font-semibold cursor-pointer transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isHovered ? (
        // 기본 상태 (자격증 단계)
        <span>{level}</span>
      ) : (
        // Hover 상태 (단어/문법 선택 가능)
        <div className="absolute inset-0 flex">
          {/* 단어 버튼 */}
          <Link href={`/vocabulary/${level}/word`} className="w-1/2 h-full bg-nihonred text-white flex items-center justify-center">
            단어
          </Link>
          {/* 문법 버튼 */}
          <Link href={`/vocabulary/${level}/grammar`} className="w-1/2 h-full bg-white text-black flex items-center justify-center">
            문법
          </Link>
        </div>
      )}
    </div>
  );
};

export default CertificateCard;