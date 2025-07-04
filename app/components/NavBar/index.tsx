"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { useEffect, useState } from "react";
import customFetch from "@/util/custom-fetch";
import { Cookies } from "react-cookie"

const navItems = [
  { name: "단어/문법", path: "/dashboard/vocabulary", icon: "/navbar/book.png" },
  { name: "회화 연습", path: "/dashboard/conversation", icon: "/navbar/conversation.png" },
  { name: "그룹 게임", path: "/dashboard/game-mode", icon: "/navbar/game.png" },
  { name: "단어장", path: "/dashboard/wordbook", icon: "/navbar/wordbook.png" },
  { name: "프로필", path: "/dashboard/profile", icon: "/navbar/profile.png", isProfile: true },
];

interface userProfile {
  name: string;
  email: string;
  uuid : string;
}
const cookies = new Cookies()

export default function NavBar() {
  const currentPath = usePathname(); // 현재 경로 가져오기
  const [user, setUser] = useState<userProfile>();

  const getUser =async()=>{
    const res = await customFetch("profile",{
    method:"GET", 
  })
  if(res.ok){
    const data = await res.json()
    setUser(data)
    }
}
  useEffect(() => {
    getUser()
  }, []);


  const handleLogout = () => {
    // 쿠키 삭제 구현
    cookies.remove('accessToken', { path: '/' });
    cookies.remove('refreshToken', { path: '/' });
    alert("로그아웃 되었습니다.");
  };
  return (
    <div className="fixed top-0 left-0 h-screen bg-gradient-to-tr from-[#FF4D4D] via-[#FF6B6B] to-[#FF8E8E] text-white flex flex-col w-[87px] xl:w-64 transition-all duration-300 rounded-r-2xl shadow-2xl shadow-[#a03e3e]/50">
      <nav className="ml-7 pt-8">
        {/* 로고 */}
        <Link href="/dashboard/vocabulary" className="flex items-center space-x-3 text-white font-bold text-2xl transition-all duration-300">
          <Image src="/navbar/clover.png" alt="Logo" width={32} height={32} priority />
          <span className="hidden xl:inline">NihonClover</span>
        </Link>

        {/* 네비게이션 */}
        <ul className="mt-7 space-y-4 -ml-3.5">
          {navItems.map(({ path, name, icon, isProfile }) => (
            <li key={path} className={isProfile ? "xl:hidden" : ""}>
              <Link href={path}>
                <div
                  className={classNames(
                    "group nav-item", // 기본 스타일
                    "nav-item-hover", // hover 효과
                    currentPath === path && "nav-item-active" // 현재 경로 표시
                  )}
                >
                  {/* 툴팁 추가 */}
                  <div className="relative group">
                    <span className="tooltip">{name}</span>
                    <Image src={icon} alt={name} width={28} height={28} priority />
                  </div>
                  <span className="hidden xl:inline">{name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

<div className="absolute bottom-0 hidden xl:flex flex-col items-start gap-4 p-3 ml-0.5 mb-4">
  {/* 미니 프로필 */}
  <Link href="/dashboard/profile">
    <div className="profile-card">
      <div className="flex items-center">
        <Image src="/navbar/profile.png" alt="프로필 아이콘" width={40} height={40} priority />
        <p className="font-bold ml-1">{user?.name}</p>
      </div>
      <p className="text-sm mt-1 ml-1">{user?.email}</p>
    </div>
  </Link>

  {/* 로그아웃 */}
  <Link href="/login" onClick={handleLogout}>
    <div className="logout-card cursor-pointer">
      <p className="font-bold ml-1">로그아웃</p>
    </div>
  </Link>
</div>
    </div>
  );
}