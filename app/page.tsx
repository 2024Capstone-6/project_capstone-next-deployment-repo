
import { redirect } from "next/navigation";

export default function Home(): never {
  // 메인 화면 리다이렉션
  redirect("/dashboard/login");
}
