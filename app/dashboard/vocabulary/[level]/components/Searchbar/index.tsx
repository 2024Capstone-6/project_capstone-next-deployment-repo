import React, { useState } from "react";
import { FiSearch } from "react-icons/fi"; // 돋보기 아이콘 추가

// ✅ 단어와 문법을 하나의 공통 타입으로 통합
interface SearchItem {
  id: number;
  mainText: string;
  furigana?: string;
  meaning: string;
}

// ✅ SearchbarProps 수정
interface SearchbarProps {
  searchItems: SearchItem[]; // 🔹 단어 또는 문법 목록
  onSelectItem: (selectedItemId: number) => void; // 🔹 선택한 아이템의 ID 전달
}

export default function Searchbar({ searchItems, onSelectItem }: SearchbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (query.trim() === "") {
      setFilteredItems([]);
    } else {
      setFilteredItems(
        searchItems.filter(
          (item) =>
            item.mainText.includes(query) ||
            (item.furigana && item.furigana.includes(query)) ||
            item.meaning.includes(query)
        )
      );
    }
  };

  return (
    <div className="relative w-[800px] h-[50px] flex items-center border-2 border-nihonred rounded-lg px-4 bg-white">
      {/* 돋보기 아이콘 */}
      <FiSearch className="text-nihonred w-5 h-5 mr-2" />

      {/* 검색 입력창 */}
      <input
        type="text"
        placeholder="검색"
        value={searchTerm}
        onChange={handleSearch}
        className="flex-1 outline-none bg-transparent"
      />

      {/* 연관 검색어 리스트 */}
      {searchTerm.trim() !== "" && (
        <ul className="absolute left-0 top-full w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-[200px] overflow-y-auto z-10">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-all"
                onClick={() => {
                  onSelectItem(item.id); // 🔹 선택한 아이템 ID 전달
                  setSearchTerm(""); // 🔹 검색창 초기화
                  setFilteredItems([]); // 🔹 연관 검색어 숨김
                }}
              >
                {item.mainText}: {item.meaning} {item.furigana && `- ${item.furigana}`}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">검색 결과 없음</li>
          )}
        </ul>
      )}
    </div>
  );
}
