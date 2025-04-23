import ChatWindowFree from "@/app/components/ChatWindow/ChatWindowFree";
import ChatHeader from "@/app/components/ChatHeader";

export default function FreeTalkPage() {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <ChatHeader />
      <ChatWindowFree />
    </div>
  );
}