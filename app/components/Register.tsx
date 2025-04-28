"use client"

import customFetch from "@/util/custom-fetch"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function Register(){
  const [showPassword,setShowPassword] = useState(false)
  const [showCheckPassword,setShowCheckPassword] = useState(false)
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [checkPassword,setCheckPassword]=useState('')
  const [pwErr,setPwErr]=useState(false)
  const [confirmPwErr,setConfirmPwErr]=useState(false)
  const [emailErr,setEmailErr]=useState(false)
  const [errMessage,setErrMessage]=useState('')
  const router = useRouter()

  const handlePasswordBlur = () => {
    const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%.*?&])[A-Za-z\d@$!%*.?&]{0,16}$/
    if(!passwordRegExp.test(password)){
      setErrMessage('Please ensure the password format is correct.')
      setPwErr(true)
    }
    else{
      setErrMessage('')
      setPwErr(false)
    }
  }

  const handleConfirmPasswordBlur = () => {
    if(password!==checkPassword){
      setErrMessage('Passwords do not match.')
      setConfirmPwErr(true)
    }
    else{
      setErrMessage('')
      setConfirmPwErr(false)
    }
  }

  const handleEmailBlur = () => {
    const emailRegExp = /^[A-Za-z0-9]+[@]{1}[A-Za-z0-9]+[.]{1}[A-Za-z.]{3,5}$/
    if(!emailRegExp.test(email)){
      setErrMessage('Please ensure the email format is correct.')
      setEmailErr(true)
    }
    else{
      setErrMessage('')
      setEmailErr(false)
    }
  }
  


  const signUpHandler= async ()=>{
    const res = await customFetch("/auth/signup",{
      method:"POST",
      body: JSON.stringify({
        //"name":name,
        "email":email,"password":password,"name":name})
    })
    if (res.ok){
      alert('회원가입 성공')
      router.push('/login')
    }
    else{
      alert('이메일이 중복되었습니다.')
    }
  }
    
    
  



  return(
    <div className="w-[50%] min-w-[200px]  bg-white p-8 rounded-lg shadow-lg mx-[25%]">
      
      {/* 이름 */}
      <label className="block mb-2 text-sm font-semibold">Name</label>
      
      <input type="text" 
        className="w-full p-3 border rounded mb-4" 
        placeholder="Enter your name" 
        onChange={(e)=>{setName(e.target.value);}}
      />
      
      {/* 이메일 */}
      <label className="block mb-2 text-sm font-semibold">Email</label>
      {emailErr?
        <input type="email"
        className="w-full p-3 border border-red-500 rounded mb-4"
        placeholder="Enter your email"
        onChange={(e)=>{setEmail(e.target.value)}}
        onBlur={handleEmailBlur}
      />:
        <input type="email"
        className="w-full p-3 border rounded mb-4"
        placeholder="Enter your email"
        onChange={(e)=>{setEmail(e.target.value)}}
        onBlur={handleEmailBlur}
      />}
      
      {/* 비밀번호 */}
      <label className="block mb-2 text-sm font-semibold">Password</label>
      {pwErr?
      <div className="relative mb-5">    
        <input
          type={showPassword ? 'text' : 'password'}
          className="w-full p-3 border border-red-500 rounded"
          placeholder="Enter your password"
          name="pw"
          onChange={(e)=>{setPassword(e.target.value)}}
          onBlur={handlePasswordBlur}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          👁
        </button>        
      </div>
      :
      <div className="relative mb-5">    
        <input
          type={showPassword ? 'text' : 'password'}
          className="w-full p-3 border rounded"
          placeholder="Enter your password"
          name="pw"
          onChange={(e)=>{setPassword(e.target.value)}}
          onBlur={handlePasswordBlur}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          👁
        </button>
      </div>}
      
      {/* 비밀번호 체크 */}
      <label className="block mb-2 text-sm font-semibold">Password Check</label>
      
      {confirmPwErr?
      
      <div className="relative mb-5">    
        <input
          type={showCheckPassword ? 'text' : 'password'}
          className="w-full p-3 border border-red-500 rounded"
          placeholder="Enter your password"
          onChange={(e)=>{setCheckPassword(e.target.value)}}
          onBlur={handleConfirmPasswordBlur}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
          onClick={() => setShowCheckPassword(!showCheckPassword)}
        >
          👁
        </button>
      </div>
      :
      <div className="relative mb-5">    
        <input
          type={showCheckPassword ? 'text' : 'password'}
          className="w-full p-3 border rounded"
          placeholder="Enter your password"
          onChange={(e)=>{setCheckPassword(e.target.value)}}
          onBlur={handleConfirmPasswordBlur}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
          onClick={() => setShowCheckPassword(!showCheckPassword)}
        >
          👁
        </button>
      </div>
      }

      {/* 경고창 */}
      <div className="flex justify-center text-red-600 m-1">
        {errMessage ? errMessage:''}
      </div>
      {email&&password&&name&&checkPassword ?
        password===checkPassword?
          errMessage?
            <div className="w-full mt-2 border p-3 rounded text-center font-semibold"  >Sign Up</div>
              :<button className="w-full mt-2 border bg-red-500 p-3 rounded font-semibold" onClick={signUpHandler}>Sign Up</button>
            :<div className="w-full mt-2 border p-3 rounded text-center font-semibold" >Sign Up</div>
          :<div className="w-full mt-2 border p-3 rounded text-center font-semibold" >Sign Up</div>}
    </div>
  )
}