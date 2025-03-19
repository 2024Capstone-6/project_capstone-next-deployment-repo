"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Scenario {
  scenario_id: number;
  scenario_name: string;
}

export default function ScenarioList() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await fetch("http://localhost:4000/chatbot/scenarios");
        if (!response.ok) {
          throw new Error("네트워크 응답에 문제가 있습니다.");
        }
        const data: Scenario[] = await response.json();
        setScenarios(data);
      } catch (error) {
        console.error("시나리오 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchScenarios();
  }, []);

  const handleClick = (scenarioId: number) => {
    router.push(`/dashboard/conversation/${scenarioId}/practice`);
  };

  return (
    <div className="mt-10 w-full flex justify-center">
      <div className="w-[1010px] h-[530px] grid grid-cols-5 gap-x-4 gap-y-3 p-5">
        {scenarios.map((scenario) => (
          <button
            key={scenario.scenario_id}
            onClick={() => handleClick(scenario.scenario_id)}
            className="w-[180px] h-[60px] bg-white text-xl font-semibold text-gray-800 rounded-lg shadow-md hover:bg-gray-200 transition-all"
          >
            {scenario.scenario_name}
          </button>
        ))}
      </div>
    </div>
  );
}
