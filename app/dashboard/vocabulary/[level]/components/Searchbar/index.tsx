import React, { useState } from "react";
import { FiSearch } from "react-icons/fi"; // 돋보기 아이콘 추가

interface Word {
  word_id: number;
  word: string;
  word_furigana: string;
  word_meaning: string;
  word_level: string;
}

interface SearchbarProps {
  searchWords: Word[];
  onSelectWord: (selectedWordId: number) => void; // 🔹 클릭한 단어의 ID를 넘기는 함수
}

export default function Searchbar({ searchWords, onSelectWord }: SearchbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (query.trim() === "") {
      setFilteredWords([]);
    } else {
      setFilteredWords(
        searchWords.filter(
          (word) =>
            word.word.includes(query) ||
            word.word_furigana.includes(query) ||
            word.word_meaning.includes(query)
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
        placeholder="단어 검색"
        value={searchTerm}
        onChange={handleSearch}
        className="flex-1 outline-none bg-transparent"
      />

      {/* 연관 검색어 리스트 */}
      {searchTerm.trim() !== "" && (
        <ul className="absolute left-0 top-full w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-[200px] overflow-y-auto z-10">
          {filteredWords.length > 0 ? (
            filteredWords.map((word) => (
              <li
                key={word.word_id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-all"
                onClick={() => {
                  onSelectWord(word.word_id); // 🔹 클릭한 단어의 ID 전달
                  setSearchTerm(""); // 🔹 검색창 초기화
                  setFilteredWords([]); // 🔹 연관 검색어 숨김
                }}
              >
                {word.word}: {word.word_meaning} - {word.word_furigana}
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
