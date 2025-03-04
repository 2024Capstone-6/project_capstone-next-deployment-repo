export default function Wordbook() {
  return (
    <div className="flex flex-col items-center justify-center min-w-[1150px] max-w-[1150px] min-h-[680px] mx-auto overflow-x-hidden">
      {/* 단어 단어장 카테고리 */}
      <div className="w-full text-left font-bold text-2xl ml-16 mt-5">단어</div>

      {/* 단어 단어장 목록 영역 */}
      <div className="w-[1100px] h-[280px] border-2 border-nihonred rounded-lg mt-3 flex flex-wrap p-3 gap-4 mx-auto">
        {/* 단어장 추가 버튼 */}
        <div className="w-[120px] h-[120px] border-2 border-nihonred flex items-center justify-center rounded-lg cursor-pointer">
          <span className="text-5xl font-bold text-nihonred pb-3">+</span>
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-[1150px] h-[2px] bg-nihonred my-3 mx-auto"></div>

      {/* 문법 단어장 카테고리 */}
      <div className="w-full text-left font-bold text-2xl ml-16">문법</div>

      {/* 문법 단어장 목록 영역 */}
      <div className="w-[1100px] h-[280px] border-2 border-nihonred rounded-lg mt-3 flex flex-wrap p-3 gap-4 mx-auto">
        {/* 문법 단어장 추가 버튼 */}
        <div className="w-[120px] h-[120px] border-2 border-nihonred flex items-center justify-center rounded-lg cursor-pointer">
          <span className="text-5xl font-bold text-nihonred pb-3">+</span>
        </div>
      </div>
    </div>
  );
}
