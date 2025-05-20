"use client";

import React, { useEffect, useState } from "react";
import WordbookModal from "../WordbookModal";
import WordbookItem from "../WordbookItem";
import customFetch from "@/util/custom-fetch";

// 단어장/문법장 타입 공통
interface Book {
  id: number;
  title: string;
}

// 공통 섹션
interface BookSectionProps {
  title: string;
  books: Book[];
  onAdd: () => void;
  onDelete: (id: number) => void;
}

const BookSection: React.FC<BookSectionProps> = ({ title, books, onAdd, onDelete }) => (
  <div className="w-full">
    <div className="text-left font-bold text-2xl ml-10 mb-4">{title}</div>
    <div className="w-[1120px] min-h-[148px] max-h-[555px] border-2 border-nihonred rounded-lg flex flex-wrap p-3 gap-4 overflow-y-auto mx-auto">
      {books.map((book) => (
        <WordbookItem
          key={book.id}
          id={book.id}
          title={book.title}
          type={title === "단어장" ? "word" : "grammar"}
          onDelete={() => onDelete(book.id)}
        />
      ))}
      <div
        className="w-[120px] h-[120px] border-2 border-nihonred flex items-center justify-center rounded-lg cursor-pointer"
        onClick={onAdd}
      >
        <span className="text-5xl font-bold text-nihonred pb-3">+</span>
      </div>
    </div>
  </div>
);

export default function WordbookClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<"word" | "grammar" | null>(null);

  const [wordbooks, setWordbooks] = useState<Book[]>([]);
  const [grammarbooks, setGrammarbooks] = useState<Book[]>([]);

  const openModal = (target: "word" | "grammar") => {
    setModalTarget(target);
    setIsModalOpen(true);
  };

  const handleCreateBook = async (title: string) => {
    if (!modalTarget) return;
    try {
      const endpoint = modalTarget === "word" ? "words/books" : "grammars/books";
      const field = modalTarget === "word" ? "wordbook_title" : "grammarbook_title";

      const res = await customFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ [field]: title }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn("생성 실패:", errorText);
        alert("이미 존재하는 이름입니다.");
        return;
      }

      const data = await res.json();
      const newBook: Book = {
        id: modalTarget === "word" ? data.wordbook_id : data.grammarbook_id,
        title: modalTarget === "word" ? data.wordbook_title : data.grammarbook_title,
      };

      if (modalTarget === "word") {
        setWordbooks((prev) => [...prev, newBook]);
      } else {
        setGrammarbooks((prev) => [...prev, newBook]);
      }
    } catch (err) {
      alert("⚠️ 단어장 생성 중 알 수 없는 오류 발생");
      console.error(err);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDeleteBook = async (target: "word" | "grammar", id: number) => {
    try {
      const endpoint = target === "word" ? `words/books/${id}` : `grammars/books/${id}`;
      const res = await customFetch(endpoint, { method: "DELETE" });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn("삭제 실패:", errorText);
        alert("❌ 삭제에 실패했습니다.");
        return;
      }

      if (target === "word") {
        setWordbooks((prev) => prev.filter((book) => book.id !== id));
      } else {
        setGrammarbooks((prev) => prev.filter((book) => book.id !== id));
      }
    } catch (err) {
      alert("❌ 삭제 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchWordbooks = async () => {
      try {
        const res = await customFetch("words/books");
        const data = await res.json();
        const formatted: Book[] = data.map((d: any) => ({
          id: d.wordbook_id,
          title: d.wordbook_title,
        }));
        setWordbooks(formatted);
      } catch (err) {
        console.error("❌ 단어장 불러오기 실패:", err);
      }
    };

    const fetchGrammarbooks = async () => {
      try {
        const res = await customFetch("grammars/books");
        const data = await res.json();
        const formatted: Book[] = data.map((d: any) => ({
          id: d.grammarbook_id,
          title: d.grammarbook_title,
        }));
        setGrammarbooks(formatted);
      } catch (err) {
        console.error("❌ 문법장 불러오기 실패:", err);
      }
    };

    fetchWordbooks();
    fetchGrammarbooks();
  }, []);

  return (
    <div className="flex flex-col items-center min-w-[1150px] max-w-[1150px] min-h-[680px] mx-auto overflow-x-hidden pt-14 space-y-10">
      <BookSection
        title="단어장"
        books={wordbooks}
        onAdd={() => openModal("word")}
        onDelete={(id) => handleDeleteBook("word", id)}
      />

      <div className="w-full border-t border-nihonred" />

      <BookSection
        title="문법장"
        books={grammarbooks}
        onAdd={() => openModal("grammar")}
        onDelete={(id) => handleDeleteBook("grammar", id)}
      />

      {modalTarget && (
        <WordbookModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateBook}
        />
      )}
    </div>
  );
}
