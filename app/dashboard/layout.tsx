import NavBar from "../components/NavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <NavBar />
      <div className="flex-1 ml-[87px] xl:ml-64 bg-white flex flex-col">
        {children}
      </div>
    </div>
  );
}
