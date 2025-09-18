import { PatientCard } from '../PatientCard';

export default function PatientCardExample() {
  //todo: remove mock functionality
  const handleViewCase = (id: string) => {
    console.log('View case triggered for:', id);
  };

  return (
    <div className="space-y-4 max-w-sm">
      <PatientCard
        id="1"
        name="Sarah Johnson"
        age={34}
        gender="Female" 
        medicalId="MED-2024-0001"
        caseTitle="Suspected micro-fracture in wrist"
        status="analyzing"
        priority="high"
        lastUpdate="2 mins ago"
        onViewCase={handleViewCase}
      />
      <PatientCard
        id="2"
        name="Michael Chen"
        age={28}
        gender="Male"
        medicalId="MED-2024-0002"
        caseTitle="Post-workout ankle pain assessment"
        status="diagnosed"
        priority="medium"
        lastUpdate="15 mins ago"
        onViewCase={handleViewCase}
      />
    </div>
  );
}