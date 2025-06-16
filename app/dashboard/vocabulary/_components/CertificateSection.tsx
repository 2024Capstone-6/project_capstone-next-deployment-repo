"use client";
import { useState } from "react";
import CertificateCard from "@/app/components/CertificateCard";

interface Certificate {
  category: string;
}

interface Props {
  certificates: Certificate[];
}

const certificateLevels: Record<string, string[]> = {
  JLPT: ["JLPT N1", "JLPT N2", "JLPT N3", "JLPT N4", "JLPT N5"],
  JPT: ["JPT 950", "JPT 850", "JPT 750", "JPT 650", "JPT 550"],
  BJT: ["BJT J1+", "BJT J1", "BJT J2", "BJT J3", "BJT J4"],
};

export default function CertificateSection({ certificates }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col xl:flex-row gap-4 h-full w-full transition-all duration-300 overflow-x-auto">
      {certificates.map((certificate, index) => (
        <div
          key={index}
          className={`relative rounded-xl cursor-pointer flex items-center justify-center transition-all duration-300
            ${hoveredIndex === null
              ? "flex-1"
              : hoveredIndex === index
              ? "flex-[2.5]"
              : "flex-[0.75]"}
            ${certificate.category === "JLPT"
              ? "bg-green-400"
              : certificate.category === "JPT"
              ? "bg-red-400"
              : "bg-yellow-300"}
            w-full min-h-[180px] xl:min-h-[300px] xl:h-full overflow-x-auto
          `}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <span
            className={`absolute text-white text-xl xl:text-2xl font-bold select-none transition-opacity duration-300
              ${hoveredIndex === index ? "opacity-0" : "opacity-100"}`}
          >
            {certificate.category}
          </span>

          <div
            className={`transition-opacity duration-300 gap-2 px-2
              ${hoveredIndex === index ? "opacity-100 grid" : "opacity-0 hidden"}
              grid-cols-5 xl:grid-cols-1 w-full justify-items-center min-w-fit
            `}
          >
            {certificateLevels[certificate.category]?.map((level, idx) => (
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
  );
}
