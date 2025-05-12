import { SocketProvider } from "@/app/context/context";
import NavBar from "../../../components/NavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className="flex-1 min-h-screen overflow-y-auto">
        <SocketProvider>
          {children}
        </SocketProvider> 
      </div>
    </div>
  );
}