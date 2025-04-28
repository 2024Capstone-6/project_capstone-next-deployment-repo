"use client"

import { useEffect, useState } from "react";
import VocabularyBox from "./VocabularyBox";
import customFetch from "@/util/custom-fetch";


export default function ProfileCard() {
  const [userName,setUserName] = useState("")
  const [userEmail,setUserEmail] = useState("")

  useEffect(() =>{
    const fetching = async () => {

      const res = await customFetch("/profile",
        {
          method: "GET"
        }
      )
      const data = await res.json()
      setUserEmail(data.email)
      setUserName(data.name)
      console.log(data)
    }
    fetching()
  })

  return (
    <div className="w-full max-w-[700px] bg-white rounded-2xl shadow-md p-8 pt-20 relative">
        {/* 프로필 이미지 */}
        <div className="absolute top-[-4rem] left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-nihonred shadow-md border-4 border-white z-10">
          <span>👤</span>
        </div>

        {/* 이름, 수정 아이콘 */}
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <h2 className="text-3xl font-bold">{userName}</h2>
            {/* <Pencil size={20} className="text-nihonred cursor-pointer" /> */}
          </div>
          <p className="text-sm text-gray-500">{userEmail}</p>
        </div>
        <hr className="w-full my-6 border-t border-red-200" />
      <VocabularyBox />
    </div>
  );
}
