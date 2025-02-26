import NavBar from "../components/NavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <NavBar />
      <div className="flex-1 ml-[85px] xl:ml-64 min-h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}