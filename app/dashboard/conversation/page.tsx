import ScenarioList from "./components/ScenarioList";

export default function ConversationPage() {
  return (
    <div className="w-full min-h-screen px-4 py-10 flex flex-col items-center overflow-auto">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-nihonred text-center">
        상황별로 연습해 보세요!
      </h1>
      <div className="w-full max-w-screen-xl mt-10">
        <ScenarioList />
      </div>
    </div>
  );
}