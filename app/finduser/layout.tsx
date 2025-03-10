


export default function FinduserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-nihonred">
    {/* 상단 배경 */}
    <div className="w-full flex items-center justify-left ml-[5%] text-white text-5xl font-bold text-left p-6 whitespace-nowrap">
      <div>
        FIND USER INFO
      </div>
    </div>
    {children}
  </div>
  );
}
