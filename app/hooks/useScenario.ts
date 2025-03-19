"use client";
import { useEffect, useState } from "react";

interface Scenario {
  chatbot_message: string;
}

export function useScenario(scenarioId: number) {
  const [scenario, setScenario] = useState<Scenario | null>(null);

  useEffect(() => {
    async function fetchScenario() {
      try {
        const response = await fetch(`http://localhost:4000/chatbot/scenario/${scenarioId}`);
        if (!response.ok) return;
        const data: Scenario = await response.json();
        setScenario(data);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    }

    fetchScenario();
  }, [scenarioId]);

  return scenario;
}
