import NavBar from "./components/NavBar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="flex h-screen">
          <NavBar />
          <div className="flex-1 ml-[85px] xl:ml-64 min-h-screen overflow-y-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}