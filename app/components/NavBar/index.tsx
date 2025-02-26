"use client";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";

const navItems = [
  { name: "단어/문법", path: "/dashboard/vocabulary", icon: "/book.png" },
  { name: "회화 연습", path: "/dashboard/conversation", icon: "/conversation.png" },
  { name: "그룹 게임", path: "/dashboard/group-games", icon: "/game.png" },
  { name: "게시판", path: "/dashboard/board", icon: "/board.png" },
];

export default function NavBar() {
  return (
    <div className="fixed top-0 left-0 h-screen bg-nihonred text-white flex flex-col justify-between w-[87px] xl:w-64 transition-all duration-300">
      <nav className="ml-7 pt-8">
        {/* 로고 */}
        <Link
          href={"/dashboard/vocabulary"}
          className="flex items-center space-x-3 text-white font-bold text-2xl transition-all duration-300"
        >
          <Image src="/clover.png" alt="Logo" width={32} height={32} priority />
          <span className="hidden xl:inline">NihonClover</span>
        </Link>

        {/* 네비게이션 */}
        <ul className="mt-7 space-y-4 -ml-3.5">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <div
                  className={classNames(
                    "flex items-center space-x-3 w-14 xl:w-56 h-12 p-4 rounded-lg text-lg font-bold",
                    "hover:bg-red-300 hover:shadow-md transition-all duration-300"
                  )}
                >
                  <Image src={item.icon} alt={item.name} width={28} height={28} priority />
                  <span className="hidden xl:inline">{item.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 미니 프로필 (xl 이하에서 숨김) */}
      <div className="hidden xl:flex p-3 mb-7 ml-0.5">
        <Link href={"/profile"}>
          <div
            className={classNames(
              "w-56 bg-red-300 p-3 rounded-lg text-start hover:shadow-lg transition-all duration-300 flex flex-col"
            )}
          >
            <div className="flex items-center">
              <Image src="/profile.png" alt="프로필 아이콘" width={40} height={40} priority />
              <p className="font-bold ml-1">박유진</p>
            </div>
            <p className="text-sm mt-1 ml-1">dbwls437711@naver.com</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
