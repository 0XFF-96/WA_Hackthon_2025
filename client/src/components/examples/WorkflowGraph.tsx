import { useState } from 'react';
import { WorkflowGraph } from '../WorkflowGraph';

export default function WorkflowGraphExample() {
  //todo: remove mock functionality
  const [isSimulating, setIsSimulating] = useState(false);

  const handleStartSimulation = () => {
    console.log('Starting simulation');
    setIsSimulating(true);
  };

  const handlePauseSimulation = () => {
    console.log('Pausing simulation');
    setIsSimulating(false);
  };

  const handleResetSimulation = () => {
    console.log('Resetting simulation');
    setIsSimulating(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <WorkflowGraph
        caseId="MED-2024-0001"
        isSimulating={isSimulating}
        onStartSimulation={handleStartSimulation}
        onPauseSimulation={handlePauseSimulation}
        onResetSimulation={handleResetSimulation}
      />
    </div>
  );
}