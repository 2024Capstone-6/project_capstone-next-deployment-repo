"use client"

import customFetch from "@/util/custom-fetch";
// import { useSocket } from "@/app/context/context";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

type Params = {
  level: string;
};

export default function SoloGamePage(){
  const params:Params = useParams()
  const product = params.level
  const productId = product.replace('T','T ')
  const router = useRouter();
  const [question, setQuestion] = useState("Loading");
  const [choices, setChoices] = useState<string[]>([]);
  const [answer,setAnswer] = useState('')
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [isModal,setIsModal] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)


  useEffect(() => {
    console.log('문제 출제')
    const question_request = async () =>{
      const res = await customFetch(`quiz-game/solo?level=${productId}`,
        {
          method: "GET"
        }
      )
      console.log(productId)
      const data = await res.json()
      console.log(data)
      const shuffledArray:string[] = data.word_quiz.sort(() => Math.random() - 0.5);
      setQuestion(data.word)
      setChoices(shuffledArray)
      setAnswer(data.word_furigana)
    }
    question_request()
    if (intervalRef.current) return;
    setTimer(10)
    intervalRef.current = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (timer === 0 && !isModal) {
      setIsModal("시간 초과!");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [timer, isModal]);

  const clickAnswer = (choice:string)=>{
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if(answer == choice){
      setIsModal(`정답! \n +10점`)
      setScore(score+10)
    }
    else{
      setIsModal("실패!")
    }
  }

  const okHandler = async () => {
    const res = await customFetch(`quiz-game/solo?level=${productId}`, {
      method: "GET"
    });
    const data = await res.json();
    console.log('data',data)
    const shuffledArray:string[] = data.word_quiz.sort(() => Math.random() - 0.5);
    setQuestion(data.word);
    setChoices(shuffledArray);
    setAnswer(data.word_furigana)
    setIsModal("");
    setTimer(10);
  
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
  };


  return(
    <div className="w-[100%] h-[80%]">
      <div className="w-full flex justify-between items-center bg-red-400 p-4 text-white rounded-md font-bold text-lg">
        <span>{productId}</span>
        <button onClick={()=>{router.push("/dashboard/game-mode/select-level")}} className="bg-white text-red-500 px-4 py-2 rounded-md">
          나가기
        </button>
      </div>

      {/* 문제 박스 */}
      <div className="w-[100%] min-w-[40rem] min-h-[30rem] h-[100%] bg-white p-6 mt-6 shadow-lg rounded-md text-center">
        {/* 타이머 */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-red-500">⏳ {timer}</span>
          <div className="w-full bg-gray-200 h-2 mx-2 rounded-full">
            <div className="bg-red-400 h-2 rounded-full" style={{ width: `${(timer / 10) * 100}%` }}></div>
          </div>
          <span className="text-red-500">My Score: {score}</span>
        </div>
        {/* 문제 */}
        <div className="mt-[10%] mb-[10%]"> 
          <h1 className="text-4xl font-bold text-red-500">{question}</h1>
        </div>
              {/* 선택지 */}
        <div className="grid grid-cols-2 gap-4 mt-6 w-[100%] h-[35%] min-w-[40rem]">
          {choices.map((choice, index) => (
            <button onClick={()=>clickAnswer(choice)} key={index} className="bg-white shadow font-jp p-4 rounded-md border border-red-300 text-lg hover:bg-red-400 hover:text-white">
              {choice}
            </button>
          ))}
        </div>
      </div>


      {isModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[60%] h-[40%] bg-white p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-4xl font-bold text-red-500 mt-8 mb-8">{isModal}</h2>
            <button 
              className="h-[25%] w-[30%] mt-5 bg-red-400 text-white px-6 py-2 rounded-md"
              onClick={() => {
                  okHandler()
                }
              }
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
