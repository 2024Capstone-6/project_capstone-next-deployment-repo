// import { SocketProvider } from "@/app/context/context";

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
        {/* <SocketProvider>
        </SocketProvider> */}
        {children}
    </div>
  );
}