// "use client";
// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import WordLayout from "../components/WordLayout";
// import customFetch from "@/util/custom-fetch";

// interface Word {
//   word_id: number;
//   word: string;
//   word_furigana: string;
//   word_meaning: string;
//   word_level: string;
// }

// export default function WordPage() {
//   const [uuid, setUuid] = useState(""); 
//   const pathname = usePathname();
//   const pathSegments = pathname.split("/");
//   const levelRaw = pathSegments[pathSegments.length - 2];
//   const [words, setWords] = useState<Word[]>([]);
//   const level = decodeURIComponent(levelRaw).replace("JLPT ", "").trim();

//   // ✅ 단어 불러오기 + 랜덤 셔플
//   const fetchWords = async () => {
//     try {
//       const response = await customFetch("/words",{method:"GET"});
//       const data: Word[] = await response.json();

//       if (level) {
//         const filteredWords = data.filter(
//           (word) => word.word_level.trim().toUpperCase() === level.toUpperCase()
//         );
//         setWords(shuffleArray(filteredWords));
//       }
//     } catch (error) {
//       console.error("오류 발생:", error);
//     }
//   };

//   useEffect(() => {
//     fetchWords();
//   }, [level]);

//   useEffect(()=> {
//     const storedUuid = localStorage.getItem("uuid");
//     if (storedUuid) setUuid(storedUuid);
//   }, []);

//   const saveShuffledWords = async (shuffledIds: number[]) => {
//     if (!uuid) return;

//     await customFetch("/user-words", {
//       method: "POST",
//       body: JSON.stringify({ uuid, shuffled_word_ids: shuffledIds })
//     })
//   };

//   const restartLearning = () => {
//     const newShuffled = shuffleArray([...words]);
//     setWords(newShuffled);
//     saveShuffledWords(newShuffled.map(w => w.word_id));
//   };

//   const shuffleArray = (array: Word[]) => {
//     return array.sort(() => Math.random() - 0.5);
//   };

//   // // ✅ "다시 학습" 버튼 클릭 시 새로 셔플
//   // const restartLearning = () => {
//   //   setWords(shuffleArray([...words])); // 🔹 기존 단어를 다시 섞음
//   // };

//   return <WordLayout words={words} onRestart={restartLearning} />;
// }

"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import WordLayout from "../components/WordLayout";
import customFetch from "@/util/custom-fetch";

interface Word {
  word_id: number;
  word: string;
  word_furigana: string;
  word_meaning: string;
  word_level: string;
}

export default function WordPage() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const levelRaw = pathSegments[pathSegments.length - 2];
  const [words, setWords] = useState<Word[]>([]);
  const [uuid, setUuid] = useState<string>(""); // UUID 상태 추가
  const level = decodeURIComponent(levelRaw).replace("JLPT ", "").trim();

  // UUID 가져오기 (예: 로그인 시스템)
  useEffect(() => {
    const storedUuid = localStorage.getItem("uuid") || "temp-uuid";
    setUuid(storedUuid);
    console.log(storedUuid + '반갑uuid')
  }, []);

  // 셔플된 단어 ID 저장 API 호출
  const saveShuffledWords = async (shuffledIds: number[]) => {
    try {
      await customFetch("/user-words", {
        method: "POST",
        body: JSON.stringify({ uuid, shuffled_word_ids: shuffledIds })
      });
    } catch (error) {
      console.error("셔플 저장 실패:", error);
    }
  };

  // ✅ 단어 불러오기 + 저장된 셔플 확인
  const fetchWords = async () => {
    try {
      // 1. 원본 단어 불러오기
      const response = await customFetch("/words", { method: "GET" });
      const data: Word[] = await response.json();

      // 2. 레벨 필터링
      const filteredWords = level 
        ? data.filter(w => w.word_level.trim().toUpperCase() === level.toUpperCase())
        : data;

      console.log('filteredWords:', filteredWords);  

      // 3. 저장된 셔플 확인
      const savedResponse = await customFetch(`/user-words?uuid=${uuid}`);
      if (savedResponse.status === 204) {
      // 204 No Content
      return { shuffled_word_ids: [] };
      }
      const savedData = await savedResponse.json();

      console.log('savedData:', savedData);
      
      if (savedData?.shuffled_word_ids && savedData.shuffled_word_ids.length > 0) {
        // 저장된 순서대로 재정렬
        const orderedWords = savedData.shuffled_word_ids
          .map((id: number) => filteredWords.find(w => w.word_id === id))
          .filter(Boolean) as Word[];
        setWords(orderedWords);
      } else {
        // 새로 셔플 후 저장
        const shuffled = shuffleArray(filteredWords);
        setWords(shuffled);
        saveShuffledWords(shuffled.map(w => w.word_id));
      }
    } catch (error) {
      console.error("단어 불러오기 실패:", error);
    }
  };

  // ✅ "다시 학습" 버튼 핸들러
  const restartLearning = () => {
    const newShuffled = shuffleArray([...words]);
    setWords(newShuffled);
    saveShuffledWords(newShuffled.map(w => w.word_id));
  };

  // 셔플 유틸리티 함수
  const shuffleArray = (array: Word[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (uuid) fetchWords();
  }, [level, uuid]);

  return <WordLayout uuid={uuid} words={words} onRestart={restartLearning} />;
}

