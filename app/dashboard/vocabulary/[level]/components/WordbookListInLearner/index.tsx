"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import customFetch from "@/util/custom-fetch";

interface WordbookListInLearnerProps {
  currentId: number;
  type: "word" | "grammar";
}

interface Book {
  id: number;
  title: string;
  items: number[]; // 포함된 단어/문법 ID 리스트
}

export default function WordbookListInLearner({ currentId, type }: WordbookListInLearnerProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "remove";
    book: Book | null;
  }>({ isOpen: false, mode: "add", book: null });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchBooks();
  }, [type]);

  const fetchBooks = async () => {
    try {
      const endpoint = type === "word" ? "words/books" : "grammars/books";
      const res = await customFetch(endpoint);
      const data = await res.json();

      const formatted: Book[] = data.map((d: any) => ({
        id: type === "word" ? d.wordbook_id : d.grammarbook_id,
        title: type === "word" ? d.wordbook_title : d.grammarbook_title,
        items: type === "word"
          ? d.word_middle?.map((wm: any) => wm.word?.word_id) || []
          : d.grammar_middle?.map((gm: any) => gm.grammar?.grammar_id) || [],
      }));

      setBooks(formatted);
    } catch (err) {
      console.error("❌ 단어장 불러오기 실패:", err);
    }
  };

  const handleBookClick = (book: Book) => {
    const alreadyIncluded = book.items.includes(currentId);
    setModalState({
      isOpen: true,
      mode: alreadyIncluded ? "remove" : "add",
      book,
    });
  };

  const handleAdd = async (book: Book) => {
    const endpoint =
      type === "word"
        ? `words/books/${book.id}/words`
        : `grammars/books/${book.id}/grammars`;

    const body = type === "word"
      ? { word_id: currentId }
      : { grammar_id: currentId };

    try {
      await customFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error("❌ 추가 실패:", err);
    } finally {
      setModalState({ isOpen: false, mode: "add", book: null });
      fetchBooks(); // 상태 최신화
    }
  };

  const handleRemove = async (book: Book) => {
    const endpoint =
      type === "word"
        ? `words/books/${book.id}/words/${currentId}`
        : `grammars/books/${book.id}/grammars/${currentId}`;

    try {
      await customFetch(endpoint, { method: "DELETE" });
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
    } finally {
      setModalState({ isOpen: false, mode: "add", book: null });
      fetchBooks();
    }
  };

  const handleCreateBook = async () => {
    if (!newTitle.trim()) return;

    try {
      const endpoint = type === "word" ? "words/books" : "grammars/books";
      const field = type === "word" ? "wordbook_title" : "grammarbook_title";

      const res = await customFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ [field]: newTitle }),
      });

      if (!res.ok) return;

      setNewTitle("");
      setCreating(false);
      fetchBooks();
    } catch (err) {
      console.error("❌ 단어장 생성 오류:", err);
    }
  };

  return (
    <>
      <div className="absolute right-[-170px] top-0 w-[160px] max-h-[300px] overflow-y-auto border-2 border-nihonred rounded-lg p-2 space-y-2 bg-white z-20">
        {books.map((book) => (
          <div
            key={book.id}
            className="w-full h-[45px] border-2 border-nihonred rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer hover:bg-red-50"
            onClick={() => handleBookClick(book)}
          >
            <span className="truncate w-[120px] px-1 text-center" title={book.title}>
              {book.title}
            </span>
          </div>
        ))}

        {creating ? (
          <div className="flex flex-col space-y-2">
            <input
              className="w-full h-[40px] border border-gray-300 px-2 rounded"
              placeholder="단어장 이름"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                className="flex-1 mr-1 bg-red-400 text-white rounded px-2 py-1 text-sm font-bold"
                onClick={handleCreateBook}
              >
                생성
              </button>
              <button
                className="flex-1 ml-1 bg-gray-300 rounded px-2 py-1 text-sm font-bold"
                onClick={() => {
                  setCreating(false);
                  setNewTitle("");
                }}
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-[45px] border-2 border-dashed border-nihonred text-2xl text-nihonred rounded-lg flex items-center justify-center cursor-pointer"
            onClick={() => setCreating(true)}
          >
            +
          </div>
        )}
      </div>

      {mounted && modalState.isOpen && modalState.book &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-[300px] text-center space-y-4">
              <p className="text-lg font-semibold">
                {modalState.mode === "add"
                  ? `"${modalState.book.title}"에 추가할까요?`
                  : `"${modalState.book.title}"에서 삭제할까요?`}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  className="px-4 py-2 bg-red-400 text-white rounded font-bold"
                  onClick={() =>
                    modalState.mode === "add"
                      ? handleAdd(modalState.book!)
                      : handleRemove(modalState.book!)
                  }
                >
                  {modalState.mode === "add" ? "추가" : "삭제"}
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 rounded font-bold"
                  onClick={() => setModalState({ isOpen: false, mode: "add", book: null })}
                >
                  취소
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
