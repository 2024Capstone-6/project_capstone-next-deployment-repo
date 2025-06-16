"use client";

import customFetch from "@/util/custom-fetch";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface word_vocalist {
  wordbook_id: number
  wordbook_title: string
  word_middle: string[]
}
interface grammer_vocalist {
  grammarbook_id: number
  grammarbook_title: string
  grammar_middle: string[]
}

export default function VocabularyBox() {
  const [vocabList,setVocabList] = useState<word_vocalist[]>([])
  const [grammerList,setGrammerList] = useState<grammer_vocalist[]>([])
  const [showModal,setShowModal] = useState('')
  const [newBookName,setNewBookName] = useState('')
  const [isEmptyModalOpen,setIsEmptyModalOpen] = useState(false)
    const router = useRouter();
  
  const fetching = async () => {
    const word_res = await customFetch("words/books", {
      method: 'GET'
    });
    const word_data = await word_res.json();
    setVocabList(word_data);
  
    const res_grammer = await customFetch("grammars/books", {
        method: 'GET'
      });
      const grammer_data = await res_grammer.json();
      setGrammerList(grammer_data);
  };
  useEffect(() => {
    fetching();
  }, []);
  
  const add_word_book = async (showModal:string,name:string)=>{
    if(showModal=='단어장'){
      console.log(name)
      await customFetch('words/books',{
        method:'POST',
        body:JSON.stringify({wordbook_title:name})
      })
      await fetching()
    }

    else if(showModal=='문법장'){
      console.log(name)
      await customFetch('grammars/books',{
        method:'POST',
        body:JSON.stringify({grammarbook_title:name})
      })
      await fetching()
    }
    setShowModal("")
    setNewBookName("")
  }

  const routing = (type:string,id:number,items:string[])=>{
    if (items.length === 0) {
      setIsEmptyModalOpen(true);
      return;
    }
    router.push(`/dashboard/vocabulary/wordbook/${id}/${type}`)
  }

  return (
    <div className="h-[20%]">
      {isEmptyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">단어장이 비어 있습니다.</p>
            <div className="flex justify-center gap-2">
              <button
                className="px-8 py-2 bg-gray-300 rounded-lg font-bold"
                onClick={() => setIsEmptyModalOpen(false)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
      <h3 className="text-md font-bold mb-2">단어장</h3>
      <div className="flex gap-3 flex-wrap">
        {vocabList.map((word, index) => (
          <button
            key={index}
            className="border px-6 py-3 text-lg rounded hover:bg-gray-100"
            onClick={()=>{
              routing('word',word.wordbook_id,word.word_middle  )
            }}
          >
            {word.wordbook_title}
          </button>
        ))}

        {/* 추가 버튼 (동그란 + 버튼) */}
        <button onClick={()=>{setShowModal('단어장')}} className="w-10 h-10 border rounded-full flex items-center justify-center text-xl">
            +
          </button>
      </div>

      <h3 className="text-md font-bold mb-2">문법장</h3>
      <div className="flex gap-3 flex-wrap">
        {grammerList.map((grammer, index) => (
          <button
            key={index}
            className="border px-6 py-3 text-lg rounded hover:bg-gray-100"
            onClick={()=>{routing('grammar',grammer.grammarbook_id,grammer.grammar_middle)}}
          >
            {grammer.grammarbook_title}
          </button>
        ))}

        {/* 추가 버튼 (동그란 + 버튼) */}
          <button onClick={()=>{setShowModal('문법장')}} className="w-10 h-10 border rounded-full flex items-center justify-center text-xl">
            +
          </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">{showModal} 입력</h2>
            <input
              type="text"
              value={newBookName}
              onChange={(e) => setNewBookName(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
              placeholder={`${showModal} 이름을 입력하세요`}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal('')}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                취소
              </button>
              <button
                onClick={()=>add_word_book(showModal,newBookName)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
