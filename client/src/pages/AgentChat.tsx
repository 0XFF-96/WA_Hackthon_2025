import { MultiAgentChat } from "@/components/MultiAgentChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageCircle, Users } from "lucide-react";

export default function AgentChat() {
  //todo: remove mock functionality
  const activeCase = {
    id: "MED-2024-0001",
    patientName: "Sarah Johnson",
    age: 34,
    condition: "Suspected micro-fracture in wrist"
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-agent-chat">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">AI Agent Consultation</h1>
          <p className="text-muted-foreground">
            Interactive multi-agent analysis and treatment planning
          </p>
        </div>
        
        {/* Current Case Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <Users className="w-4 h-4 mr-2" />
              Active Case
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold" data-testid="text-active-patient">
                  {activeCase.patientName} ({activeCase.age}y)
                </h3>
                <p className="text-sm text-muted-foreground">
                  {activeCase.condition}
                </p>
              </div>
              <Badge variant="secondary">
                Case: {activeCase.id}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <h4 className="font-semibold text-sm">Dr. Neural</h4>
            <p className="text-xs text-muted-foreground">Diagnostician</p>
            <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              Active
            </Badge>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-4 text-center">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <h4 className="font-semibold text-sm">RadiologyAI</h4>
            <p className="text-xs text-muted-foreground">Imaging Specialist</p>
            <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              Active
            </Badge>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <h4 className="font-semibold text-sm">TreatmentBot</h4>
            <p className="text-xs text-muted-foreground">Treatment Planner</p>
            <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              Active
            </Badge>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 dark:bg-purple-950/20">
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <h4 className="font-semibold text-sm">Orchestrator</h4>
            <p className="text-xs text-muted-foreground">Coordinator</p>
            <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              Active
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <MultiAgentChat 
        caseId={activeCase.id}
        patientName={activeCase.patientName}
      />
    </div>
  );
}