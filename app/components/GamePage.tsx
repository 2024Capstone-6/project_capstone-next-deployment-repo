// "use client"

// // import { useSocket } from "@/app/context/context";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { useSocket } from "../context/context";
// import customFetch from "@/util/custom-fetch";


// export default function GamePage(props:{
//   roomId: string;
//   level: string;
//   players: string[];
//   totalScores: Record<string, number>;
// }){
//   const productId = props.level
//   const router = useRouter();
//   const [question, setQuestion] = useState("Loading");
//   const [choices, setChoices] = useState<string[]>([]);
//   const [answer,setAnswer] = useState('')
//   const [score, setScore] = useState(0);
//   const [timer, setTimer] = useState(10);
//   const [isModal,setIsModal] = useState('')
//   const intervalRef = useRef<NodeJS.Timeout | null>(null)


//   useEffect(() => {
//     console.log('문제 출제')
//     const question_request = async () =>{
//       const res = await customFetch(`quiz-game/solo?level=${productId}`,
//         {
//           method: "GET"
//         }
//       )
//       console.log(productId)
//       const data = await res.json()
//       console.log(data)
//       const shuffledArray:string[] = data.word_quiz.sort(() => Math.random() - 0.5);
//       setQuestion(data.word)
//       setChoices(shuffledArray)
//       setAnswer(data.word_furigana)
//     }
//     question_request()
//     if (intervalRef.current) return;
//     setTimer(10)
//     intervalRef.current = setInterval(() => {
//       setTimer((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     if (timer === 0 && !isModal) {
//       setIsModal("시간 초과!");
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     }
//   }, [timer, isModal]);

//   const clickAnswer = (choice:string)=>{
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }
//     if(answer == choice){
//       setIsModal(`정답! \n +10점`)
//       setScore(score+10)
//     }
//     else{
//       setIsModal("실패!")
//     }
//   }

//   const okHandler = async () => {
//     const res = await customFetch(`quiz-game/solo?level=${productId}`, {
//       method: "GET"
//     });
//     const data = await res.json();
//     console.log('data',data)
//     const shuffledArray:string[] = data.word_quiz.sort(() => Math.random() - 0.5);
//     setQuestion(data.word);
//     setChoices(shuffledArray);
//     setAnswer(data.word_furigana)
//     setIsModal("");
//     setTimer(10);
  
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }
//     intervalRef.current = setInterval(() => {
//       setTimer((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);
//   };


//   return(
//     <div className="w-[100%] h-[80%]">
//       <div className="w-full flex justify-between items-center bg-red-400 p-4 text-white rounded-md font-bold text-lg">
//         <span>{productId}</span>
//       </div>

//       {/* 문제 박스 */}
//       <div className="w-[100%] min-w-[40rem] min-h-[30rem] h-[100%] bg-white p-6 mt-6 shadow-lg rounded-md text-center">
//         {/* 타이머 */}
//         <div className="flex justify-between items-center mb-4">
//           <span className="text-red-500">⏳ {timer}</span>
//           <div className="w-full bg-gray-200 h-2 mx-2 rounded-full">
//             <div className="bg-red-400 h-2 rounded-full" style={{ width: `${(timer / 10) * 100}%` }}></div>
//           </div>
//           {/* <span className="text-red-500">My Score: {score}</span> */}
//         </div>
//         {/* 문제 */}
//         <div className="mt-[10%] mb-[10%]"> 
//           <h1 className="text-4xl font-bold text-red-500">{question}</h1>
//         </div>
//               {/* 선택지 */}
//         <div className="grid grid-cols-2 gap-4 mt-6 w-[100%] h-[35%] min-w-[40rem]">
//           {choices.map((choice, index) => (
//             <button onClick={()=>clickAnswer(choice)} key={index} className="bg-white shadow font-jp p-4 rounded-md border border-red-300 text-lg hover:bg-red-400 hover:text-white">
//               {choice}
//             </button>
//           ))}
//         </div>
//       </div>


//       {isModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="w-[60%] h-[40%] bg-white p-6 rounded-xl shadow-lg text-center">
//             <h2 className="text-4xl font-bold text-red-500 mt-8 mb-8">{isModal}</h2>
//             <button 
//               className="h-[25%] w-[30%] mt-5 bg-red-400 text-white px-6 py-2 rounded-md"
//               onClick={() => {
//                   okHandler()
//                 }
//               }
//             >
//               확인
//             </button>
//           </div>
//         </div>
//       )}
//       <div className="flex gap-6 mt-8 justify-center">
//         {props.players.map((player) => (
//           <div key={player} className="flex flex-col items-center">
//             <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-red-500 mb-2">
//               {player[0]?.toUpperCase() || "?"}
//             </div>
//             <span className="text-sm font-semibold">{player}</span>
//             <span className="text-xs text-gray-600 mt-1">
//               점수: {props.totalScores?.[player] ?? 0}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

"use client"

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/context";

interface GamePageProps {
  roomId: string;
  level: string;
  players: string[];
  totalScores: Record<string, number>;
}

export default function GamePage(props: GamePageProps) {
  const { socket } = useSocket();
  const router = useRouter();

  // 게임 상태
  const [question, setQuestion] = useState("Loading...");
  const [choices, setChoices] = useState<string[]>([]);
  const [timer, setTimer] = useState(5);
  const [isModal, setIsModal] = useState<string | null>(null);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(10);
  const [totalScores, setTotalScores] = useState<Record<string, number>>(props.totalScores || {});
  const [answered, setAnswered] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 소켓 이벤트 연결
  useEffect(() => {
    if (!socket) return;

    // 새 문제 출제 (모든 참가자에게 동일)
    const handleNewQuestion = (data: {
      question: string;
      choices: string[];
      round: number;
      totalRounds: number;
    }) => {
      // 문제 데이터가 제대로 오는지 로그로 확인!
      console.log('newQuestion 이벤트 데이터:', data);

      setQuestion(data.question);
      setChoices(data.choices);
      setRound(data.round);
      setTotalRounds(data.totalRounds);
      setTimer(5);
      setIsModal(null);
      setAnswered(false);

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    };

    // 점수 등 방 상태 실시간 갱신
    const handleRoomUpdate = (room: any) => {
      setTotalScores(room.totalScores || {});
    };

    // 정답 결과 안내
    const handleAnswerResult = (data: { correct: boolean; score: number; alreadyAnswered?: boolean }) => {
      if (data.alreadyAnswered) {
        setIsModal("이미 정답을 제출했습니다!");
      } else if (data.correct) {
        setIsModal(`정답! +${data.score}점`);
      } else {
        setIsModal("오답!");
      }
      setAnswered(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    // 게임 종료
    const handleGameOver = (data: { totalScores: Record<string, number> }) => {
      setIsModal(`게임 종료!\n최종 점수:\n${Object.entries(data.totalScores)
        .map(([user, score]) => `${user}: ${score}점`)
        .join('\n')}`);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    socket.on("newQuestion", handleNewQuestion);
    socket.on("roomUpdate", handleRoomUpdate);
    socket.on("answerResult", handleAnswerResult);
    socket.on("gameOver", handleGameOver);

    return () => {
      socket.off("newQuestion", handleNewQuestion);
      socket.off("roomUpdate", handleRoomUpdate);
      socket.off("answerResult", handleAnswerResult);
      socket.off("gameOver", handleGameOver);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [socket]);

  // 타이머 0초(시간초과) 처리
  useEffect(() => {
    if (timer === 0 && !isModal) {
      setIsModal("시간 초과!");
      setAnswered(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
      // 서버에서 자동으로 다음 라운드로 넘어감
    }
  }, [timer, isModal]);

  // 선택지 클릭 (정답 제출)
  const clickAnswer = (choice: string) => {
    if (answered || !socket) return;
    socket.emit("submitAnswer", { roomId: props.roomId, answer: choice });
    setAnswered(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // 모달 확인(다음 문제 대기)
  const okHandler = () => {
    setIsModal(null);
    setAnswered(false);
    // 다음 문제는 서버에서 자동 출제(newQuestion 이벤트)로 넘어감
  };

  return (
    <div className="w-[100%] h-[80%]">
      <div className="w-full flex justify-between items-center bg-red-400 p-4 text-white rounded-md font-bold text-lg">
        <span>{props.level} | 라운드 {round} / {totalRounds}</span>
      </div>

      {/* 문제 박스 */}
      <div className="w-[100%] min-w-[40rem] min-h-[30rem] h-[100%] bg-white p-6 mt-6 shadow-lg rounded-md text-center">
        {/* 타이머 */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-red-500">⏳ {timer}</span>
          <div className="w-full bg-gray-200 h-2 mx-2 rounded-full">
            <div className="bg-red-400 h-2 rounded-full" style={{ width: `${(timer / 5) * 100}%` }}></div>
          </div>
        </div>
        {/* 문제 */}
        <div className="mt-[10%] mb-[10%]"> 
          <h1 className="text-4xl font-bold text-red-500">{question}</h1>
        </div>
        {/* 선택지 */}
        <div className="grid grid-cols-2 gap-4 mt-6 w-[100%] h-[35%] min-w-[40rem]">
          {choices.map((choice, index) => (
            <button
              onClick={() => clickAnswer(choice)}
              key={index}
              className={`bg-white shadow font-jp p-4 rounded-md border border-red-300 text-lg hover:bg-red-400 hover:text-white ${answered ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>

      {/* 참가자 점수 현황 */}
      <div className="flex gap-6 mt-8 justify-center">
        {props.players.map((player) => (
          <div key={player} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-red-500 mb-2">
              {player[0]?.toUpperCase() || "?"}
            </div>
            <span className="text-sm font-semibold">{player}</span>
            <span className="text-xs text-gray-600 mt-1">
              점수: {totalScores?.[player] ?? 0}
            </span>
          </div>
        ))}
      </div>

      {/* 모달 */}
      {isModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[60%] h-[40%] bg-white p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-4xl font-bold text-red-500 mt-8 mb-8 whitespace-pre-line">{isModal}</h2>
            <button 
              className="h-[25%] w-[30%] mt-5 bg-red-400 text-white px-6 py-2 rounded-md"
              onClick={okHandler}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

