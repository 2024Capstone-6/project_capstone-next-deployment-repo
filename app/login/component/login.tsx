"use client"

import { useState } from "react"
import cookies from "react-cookies"

export default function LoginCompo(){
  const [showPassword,setShowPassword] = useState(false)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')

  const LoginHandler = async() =>{
    const data = await fetch("http://localhost:4000/auth/login",{
      method:"POST",
      body:JSON.stringify({"email" :email,"password":password})
    })
    .then(res=>res.json())
    // 현재시간 받아옴.
    // 현재시간 +60분만큼 유효시간으로 지정정
    const access_time = new Date()
    access_time.setMinutes(access_time.getMinutes()+60)
    // 쿠키 저장 이름, 쿠키저장 값, 옵션 path:'/'는 모든곳에서 쿠키사용, expires는 유효시간
    cookies.save('token',data.token,{path:'/',expires:access_time})
    
  }

  return(
    <div className="w-[50%] min-w-[300px]  bg-white p-8 rounded-lg shadow-lg mx-[25%]">
          <label className="block mb-2 text-sm font-semibold">Email</label>
          <input type="email" className="w-full p-3 border rounded mb-4" placeholder="Enter your email" onChange={(e)=>{setEmail(e.target.value)}}/>

          <label className="block mb-2 text-sm font-semibold">Password</label>
          <div className="relative mb-5">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full p-3 border rounded"
              placeholder="Enter your password"
              onChange={(e)=>{setPassword(e.target.value)}}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </button>
          </div>

          <button type='submit' className="w-full mt-2 bg-red-500 text-white p-3 rounded font-semibold" onClick={LoginHandler}>Login</button>
          
          <button className="w-full mt-2 border p-3 rounded font-semibold">Sign Up</button>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t"></div>
            <span className="px-4 text-sm text-gray-500">OR</span>
            <div className="flex-grow border-t"></div>
          </div>

          <button className="w-full flex items-center justify-center border p-3 rounded mb-2 font-semibold">
            Google로 시작하기
          </button>
          <button className="w-full flex items-center justify-center bg-yellow-400 p-3 rounded font-semibold">
            카카오톡으로 시작하기
          </button>
          
          <p className="mt-4 text-sm text-red-500 cursor-pointer text-center">이메일/비밀번호 찾기</p>
        </div>
  )
}