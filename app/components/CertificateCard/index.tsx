"use client";
import React from "react";
import Link from "next/link";

interface CertificateCardProps {
  level: string;
  wordPath: string;
  grammarPath: string;
}

const CertificateCard: React.FC<CertificateCardProps> = ({
  level,
  wordPath,
  grammarPath,
}) => {
  return (
    <div
      className="relative h-24 sm:h-28 w-[80%] max-w-[700px]
                 border-2 border-red-300 rounded-xl flex items-center justify-center
                 text-center font-semibold cursor-pointer transition-all duration-300
                 overflow-hidden group bg-white shadow-md hover:shadow-xl hover:scale-[1.05] flex-shrink-0"
    >
      {/* 기본 상태 */}
      <span className="group-hover:hidden text-nihonred text-sm sm:text-2xl">
        {level}
      </span>

      {/* Hover 상태 */}
      <div className="absolute inset-0 flex hidden group-hover:flex">
        <Link
          href={wordPath}
          className="w-1/2 h-full bg-nihonred text-white flex items-center justify-center
                   hover:bg-red-500 transition-all duration-200 text-xs sm:text-lg font-semibold"
        >
          단어
        </Link>
        <Link
          href={grammarPath}
          className="w-1/2 h-full bg-white text-black flex items-center justify-center
                   hover:bg-gray-200 transition-all duration-200 text-xs sm:text-lg font-semibold"
        >
          문법
        </Link>
      </div>
    </div>
  );
};

export default CertificateCard;
