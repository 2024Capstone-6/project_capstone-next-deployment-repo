"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


export default function resgister(){
  const [showPassword,setShowPassword] = useState(false)
  const [showCheckPassword,setShowCheckPassword] = useState(false)
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [checkPassword,setCheckPassword]=useState('')
  const [phoneNumber,setPhoneNumber]=useState('')
  const [errMessage,setErrMessage]=useState('')
  const router = useRouter()
  

  useEffect(()=>{
    const emailRegExp = /^[A-Za-z0-9]+[@]{1}[A-Za-z0-9]+[.]{1}[A-Za-z.]{3,5}$/
    const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%.*?&])[A-Za-z\d@$!%*.?&]{0,16}$/
    const phoneNumberRegExp = /^01[016789]\d{8}$/
    if(!emailRegExp.test(email)){
      setErrMessage('Please ensure the email format is correct.')
    }
    else if(!passwordRegExp.test(password)){
      setErrMessage('Please ensure the password format is correct.')
    }
    else if(password!==checkPassword){
      setErrMessage('Passwords do not match.')
    }
    else if(!phoneNumberRegExp.test(phoneNumber.replace(/-/g, ""))){
      setErrMessage('Please ensure the phone number format is correct.')
    }
    else{
      setErrMessage('')
    }
  },[email,password, checkPassword,phoneNumber])

  
  //     setErrMessage('')
  //     // const data = await fetch("http://localhost:4000/auth/signup",{
  //     //   method:"POST",
  //     //   headers: {
  //     //     "Content-Type": "application/json"
  //     //   },
  //     //   body: JSON.stringify({"name":name,"email":email,"password":password,"phone":phoneNumber})
  //     // })
  //   }
  // }
  const signUpHandler=()=>{
    
  }



  return(
    <div className="w-[50%] min-w-[300px]  bg-white p-8 rounded-lg shadow-lg mx-[25%]">
      
      {/* 이름 */}
      <label className="block mb-2 text-sm font-semibold">Name</label>
      <input type="text" className="w-full p-3 border rounded mb-4" placeholder="Enter your name" onChange={(e)=>{setName(e.target.value);}}/>
      
      {/* 이메일 */}
      <label className="block mb-2 text-sm font-semibold">Email</label>
      <input type="email" className="w-full p-3 border rounded mb-4" placeholder="Enter your email" onChange={(e)=>{setEmail(e.target.value)}}/>
      
      {/* 비밀번호 */}
      <label className="block mb-2 text-sm font-semibold">Password</label>
      <div className="relative mb-5">    
        <input
          type={showPassword ? 'text' : 'password'}
          className="w-full p-3 border rounded"
          placeholder="Enter your password"
          name="pw"
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
      
      {/* 비밀번호 체크 */}
      <label className="block mb-2 text-sm font-semibold">Password Check</label>
      <div className="relative mb-5">    
        <input
          type={showCheckPassword ? 'text' : 'password'}
          className="w-full p-3 border rounded"
          placeholder="Enter your password"
          onChange={(e)=>{setCheckPassword(e.target.value)}}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
          onClick={() => setShowCheckPassword(!showCheckPassword)}
        >
          👁
        </button>
      </div>

      {/* 전화번호 */}
      <label className="block mb-2 text-sm font-semibold">Phone Number</label>
      <input type="text" className="w-full p-3 border rounded mb-4" placeholder="Enter your number" onChange={(e)=>{setPhoneNumber(e.target.value)}}/>      

      {/* 경고창 */}
      <div className="flex justify-center text-red-600 m-1">
        {errMessage ? errMessage:''}
      </div>
      {email&&password&&name&&phoneNumber&&checkPassword ?
        errMessage?
          <div className="w-full mt-2 border p-3 rounded text-center font-semibold"  >Sign Up</div>
          :<button className="w-full mt-2 border bg-red-500 p-3 rounded font-semibold" onClick={signUpHandler}>Sign Up</button>
          :<div className="w-full mt-2 border p-3 rounded text-center font-semibold" >Sign Up</div>}
    </div>
  )
}