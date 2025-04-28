import CertificateSection from "./_components/CertificateSection";

interface Certificate {
  category: string;
}

const certificates: Certificate[] = [
  { category: "JLPT" },
  { category: "JPT" },
  { category: "BJT" },
];

export default function VocabularyPage() {
  return (
    <div className="flex min-h-screen min-w-[1280px] overflow-x-auto overflow-y-auto">
      {/* 본문 영역 */}
      <div className="flex-1 flex flex-col rounded-lg m-6 mr-0 overflow-visible">
        <div className="flex-1 rounded-lg p-6 overflow-visible">
          <CertificateSection certificates={certificates} />
        </div>
      </div>
    </div>
  );
}