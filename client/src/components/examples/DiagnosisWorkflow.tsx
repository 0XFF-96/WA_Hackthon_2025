import { DiagnosisWorkflow } from '../DiagnosisWorkflow';

export default function DiagnosisWorkflowExample() {
  //todo: remove mock functionality
  const handleStepClick = (stepId: string) => {
    console.log('Step clicked:', stepId);
  };

  return (
    <div className="max-w-md">
      <DiagnosisWorkflow
        patientName="Sarah Johnson"
        caseId="MED-2024-0001"
        currentStep={2}
        overallProgress={65}
        onStepClick={handleStepClick}
      />
    </div>
  );
}