
interface Certificate {
  category: string;
  levels: string[];
}

export default function SelectLevel(){

  const url = `${process.env.NEXT_PUBLIC_FE_BASE_URL}dashboard/game-mode/solo-game`
  const certificates: Certificate[] = [
    { category: "JLPT", levels: ["JLPT N1", "JLPT N2", "JLPT N3", "JLPT N4", "JLPT N5"] },
    { category: "JPT", levels: ["JPT 950", "JPT 850", "JPT 750", "JPT 650", "JPT 550"] },
    { category: "BJT", levels: ["BJT J1+", "BJT J1", "BJT J2", "BJT J3", "BJT J4"] },
  ];

  return(
    <div className="flex h-screen gap-4">
    {/* 본문 영역 */}
    <div className="flex-1 flex flex-col min-w-[970px] max-w-[970px] min-h-[680px] rounded-lg m-6 mr-0">
      {/* 예비 */}
      <div className="h-[60px] bg-gray-300 rounded-lg flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-700">난이도 선택</p>
      </div>

      {/* 본문 */}
      <div className="flex-1 mt-2 rounded-lg p-6 -ml-16 overflow-auto">
        <div className="flex-1 pt-4 pl-28 justify-center">
          {certificates.map((certificate, index) => (
            <div key={index} className="mb-8">
              {/* 자격증 이름 */}
              <h2 className="text-xl font-bold mb-2 text-gray-800">{certificate.category}</h2>
              {/* 자격증 단계 */}
              <div className="grid grid-cols-5 gap-2">
                {certificate.levels.map((level, idx) => (
                  <div key={idx} className="relative w-32 h-28 border-2 border-red-300 rounded-xl flex items-center justify-center
                  text-center font-semibold cursor-pointer transition-all duration-300 overflow-hidden group
                  bg-white shadow-md hover:shadow-xl hover:scale-[1.05]">
                  {/* 기본 상태 (자격증 단계) */}
                    <a className="w-[100%] h-[100%] flex items-center justify-center" href={url}>
                      <span className="text-gray-800">{level}</span>
                    </a>
                </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}