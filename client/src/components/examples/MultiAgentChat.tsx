import { MultiAgentChat } from '../MultiAgentChat';

export default function MultiAgentChatExample() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <MultiAgentChat 
        caseId="MED-2024-0001"
        patientName="Sarah Johnson"
      />
    </div>
  );
}