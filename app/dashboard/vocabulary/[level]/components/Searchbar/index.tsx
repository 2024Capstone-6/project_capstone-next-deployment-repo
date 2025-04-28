import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchItem {
  id: number;
  mainText: string;
  furigana?: string;
  meaning: string;
}

interface SearchbarProps {
  searchItems: SearchItem[];
  onSelectItem: (selectedItemId: number) => void;
}

export default function Searchbar({ searchItems, onSelectItem }: SearchbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.trim();
    setSearchTerm(query);

    if (query === "") {
      setFilteredItems([]);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = searchItems.filter((item) =>
        item.mainText.toLowerCase().includes(lowerQuery) ||
        (item.furigana && item.furigana.toLowerCase().includes(lowerQuery)) ||
        item.meaning.toLowerCase().includes(lowerQuery)
      );
      setFilteredItems(filtered);
    }
  };

  const handleSelect = (id: number) => {
    onSelectItem(id);
    setSearchTerm("");
    setFilteredItems([]);
  };

  return (
    <div className="relative w-[800px] h-[50px] flex items-center border-2 border-nihonred rounded-lg px-4 bg-white">
      <FiSearch className="text-nihonred w-5 h-5 mr-2" />
      <input
        type="text"
        placeholder="검색"
        value={searchTerm}
        onChange={handleSearch}
        className="flex-1 outline-none bg-transparent"
      />
      {searchTerm !== "" && (
        <ul className="absolute left-0 top-full w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-[200px] overflow-y-auto z-10">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-all"
                onClick={() => handleSelect(item.id)}
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
