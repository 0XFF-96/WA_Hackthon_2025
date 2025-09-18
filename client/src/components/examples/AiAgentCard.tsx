import { AiAgentCard } from '../AiAgentCard';

export default function AiAgentCardExample() {
  //todo: remove mock functionality
  return (
    <div className="space-y-4 max-w-sm">
      <AiAgentCard
        id="1"
        name="Dr. Neural"
        role="diagnostician"
        status="busy"
        confidence={92}
        currentTask="Analyzing patient MED-2024-0001 X-ray patterns"
      />
      <AiAgentCard
        id="2"
        name="RadiologyAI"
        role="radiologist"
        status="active"
        confidence={89}
        currentTask="Processing micro-fracture detection algorithms"
      />
      <AiAgentCard
        id="3"
        name="TreatmentBot"
        role="treatment_planner"
        status="idle"
        confidence={95}
      />
    </div>
  );
}