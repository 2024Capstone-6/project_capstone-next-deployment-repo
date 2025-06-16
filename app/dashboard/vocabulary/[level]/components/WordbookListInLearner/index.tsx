"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import customFetch from "@/util/custom-fetch";

// props 타입
interface WordbookListInLearnerProps {
  currentId: number;
  type: "word" | "grammar";
}

// 공통 Book 타입
interface Book {
  id: number;
  title: string;
  items: number[];
}

// words/books 응답 타입
interface RawWordBook {
  wordbook_id: number;
  wordbook_title: string;
  word_middle?: {
    word?: {
      word_id: number;
    };
  }[];
}

// grammars/books 응답 타입
interface RawGrammarBook {
  grammarbook_id: number;
  grammarbook_title: string;
  grammar_middle?: {
    grammar?: {
      grammar_id: number;
    };
  }[];
}

export default function WordbookListInLearner({ currentId, type }: WordbookListInLearnerProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "remove" | "confirmAdd" | "deleteBook";
    book: Book | null;
  }>({ isOpen: false, mode: "add", book: null });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchBooks();
  }, [type]);

  const fetchBooks = async () => {
    try {
      if (type === "word") {
        const res = await customFetch("words/books");
        const data: RawWordBook[] = await res.json();
        const formatted: Book[] = data.map((d) => ({
          id: d.wordbook_id,
          title: d.wordbook_title,
          items: d.word_middle
            ?.map((wm) => wm.word?.word_id)
            .filter((id): id is number => id !== undefined) || [],
        }));
        setBooks(formatted);
      } else {
        const res = await customFetch("grammars/books");
        const data: RawGrammarBook[] = await res.json();
        const formatted: Book[] = data.map((d) => ({
          id: d.grammarbook_id,
          title: d.grammarbook_title,
          items: d.grammar_middle
            ?.map((gm) => gm.grammar?.grammar_id)
            .filter((id): id is number => id !== undefined) || [],
        }));
        setBooks(formatted);
      }
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

  const handleBookRightClick = (e: React.MouseEvent, book: Book) => {
    e.preventDefault();
    setModalState({
      isOpen: true,
      mode: "deleteBook",
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
      fetchBooks();
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

  const handleDeleteBook = async (book: Book) => {
    const endpoint = type === "word"
      ? `words/books/${book.id}`
      : `grammars/books/${book.id}`;

    try {
      await customFetch(endpoint, { method: "DELETE" });
    } catch (err) {
      console.error("❌ 단어장 삭제 실패:", err);
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

      if (!res.ok) {
        const errorText = await res.text();
        alert(errorText);
        return;
      }

      const data = await res.json();
      const newBook: Book = {
        id: type === "word" ? data.wordbook_id : data.grammarbook_id,
        title: type === "word" ? data.wordbook_title : data.grammarbook_title,
        items: [],
      };

      setBooks((prev) => [...prev, newBook]);
      setModalState({ isOpen: true, mode: "confirmAdd", book: newBook });
    } catch (err) {
      console.error("❌ 단어장 생성 오류:", err);
    } finally {
      setNewTitle("");
      setCreating(false);
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
            onContextMenu={(e) => handleBookRightClick(e, book)}
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
              <p className="text-lg font-semibold break-all">
                {modalState.mode === "add"
                  ? `"${modalState.book.title}"에 추가할까요?`
                  : modalState.mode === "remove"
                  ? `"${modalState.book.title}"에서 삭제할까요?`
                  : modalState.mode === "deleteBook"
                  ? `"${modalState.book.title}"을 삭제할까요?`
                  : `"${modalState.book.title}"에 단어를 추가할까요?`}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  className="px-4 py-2 bg-red-400 text-white rounded font-bold"
                  onClick={() => {
                    if (modalState.mode === "add" || modalState.mode === "confirmAdd") {
                      handleAdd(modalState.book!);
                    } else if (modalState.mode === "remove") {
                      handleRemove(modalState.book!);
                    } else if (modalState.mode === "deleteBook") {
                      handleDeleteBook(modalState.book!);
                    }
                  }}
                >
                  {modalState.mode === "remove" || modalState.mode === "deleteBook" ? "삭제" : "추가"}
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
