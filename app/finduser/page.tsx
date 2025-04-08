"use client"

import { useRouter } from "next/navigation"


export default function Finduser(){

  const route = useRouter()
  const goForgotID = () =>{
    route.push("./finduser/forgotID")
  }

  const goForgotPw=()=>{
    route.push("./finduser/forgotPw")
  }
  
    return (        
        <div className="flex-[3] bg-gray-100 flex justify-center items-center p-4 px-10 ">
          <div className="flex gap-10">
            <button onClick={goForgotID}>
              <div className="w-60 h-60 bg-gray-300 flex flex-col justify-center items-center text-[20px] hover:bg-gray-400" >
                  <img src="/profile.png" alt="img" className="w-[50%] mb-4" />
                  <h1>Forgot ID</h1>
              </div>
            </button>
            <button onClick={goForgotPw}>
              <div className="w-60 h-60 bg-gray-300 flex flex-col justify-center items-center text-[20px] hover:bg-gray-400">
                <img src="/key.png" alt="" className="w-[50%] mb-4"/>
                <h1 >Forgot PW</h1>
              </div>
            </button>
          </div>
        </div>
    );
}