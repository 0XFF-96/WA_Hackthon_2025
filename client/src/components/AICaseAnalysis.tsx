import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Stethoscope, 
  UserCheck, 
  Settings, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw
} from "lucide-react";
import type { CaseWithDetails } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface AgentResponse {
  agentType: 'orchestrator' | 'diagnostician' | 'radiologist' | 'treatment_planner';
  agentName: string;
  content: string;
  confidence: number;
  reasoning?: string;
}

interface AICaseAnalysisProps {
  caseData: CaseWithDetails;
}

const agentConfig = {
  orchestrator: {
    name: "HealthAI Orchestrator",
    icon: Settings,
    color: "bg-blue-500",
    description: "Coordinating multi-agent analysis"
  },
  diagnostician: {
    name: "Dr. Neural",
    icon: Stethoscope,
    color: "bg-green-500", 
    description: "Primary diagnostic analysis"
  },
  radiologist: {
    name: "RadiAI",
    icon: Brain,
    color: "bg-purple-500",
    description: "Medical imaging interpretation"
  },
  treatment_planner: {
    name: "CarePath AI",
    icon: UserCheck,
    color: "bg-orange-500",
    description: "Treatment planning & care coordination"
  }
};

function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return "text-green-600 bg-green-50";
  if (confidence >= 60) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

export function AICaseAnalysis({ caseData }: AICaseAnalysisProps) {
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<AgentResponse[]>([]);
  const { toast } = useToast();

  // AI analysis mutation
  const analysisMutation = useMutation({
    mutationFn: async ({ query, patientContext }: { 
      query: string;
      patientContext: {
        name: string;
        age: number;
        symptoms: string;
        medicalHistory?: string;
      };
    }) => {
      const response = await apiRequest('POST', '/api/ai/analyze-case', {
        query,
        patientContext
      });
      return response.json();
    },
    onSuccess: (data: AgentResponse[]) => {
      setResponses(data);
      toast({
        title: "AI Analysis Complete",
        description: `Received insights from ${data.length} AI agents`,
      });
    },
    onError: (error: any) => {
      console.error('AI analysis error:', error);
      toast({
        title: "Analysis Error",
        description: error?.message || "Failed to get AI analysis. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!query.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a question or request for analysis.",
        variant: "destructive",
      });
      return;
    }

    // Prepare patient context from case data
    const patientContext = {
      name: caseData.patient.name,
      age: caseData.patient.age,
      symptoms: caseData.description || "No symptoms recorded",
      medicalHistory: caseData.patient.medicalHistory || undefined
    };

    analysisMutation.mutate({ query, patientContext });
  };

  const handleQuickAnalysis = () => {
    setQuery("Please analyze this patient's case and provide a differential diagnosis for potential micro-fractures based on the available clinical data.");
    
    // Auto-trigger analysis with the default query
    const patientContext = {
      name: caseData.patient.name,
      age: caseData.patient.age,
      symptoms: caseData.description || "No symptoms recorded",
      medicalHistory: caseData.patient.medicalHistory || undefined
    };

    analysisMutation.mutate({ 
      query: "Please analyze this patient's case and provide a differential diagnosis for potential micro-fractures based on the available clinical data.", 
      patientContext 
    });
  };

  return (
    <div className="space-y-6" data-testid="ai-case-analysis">
      {/* Analysis Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            AI-Powered Case Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Ask our multi-agent AI system to analyze this patient case for diagnostic insights, 
            treatment recommendations, and risk assessments.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your analysis request (e.g., 'Analyze potential micro-fractures', 'Assess fall risk', 'Recommend treatment options')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[80px]"
            data-testid="textarea-analysis-query"
          />
          <div className="flex gap-3">
            <Button 
              onClick={handleAnalyze}
              disabled={analysisMutation.isPending || !query.trim()}
              data-testid="button-analyze-custom"
            >
              {analysisMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze Case
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={handleQuickAnalysis}
              disabled={analysisMutation.isPending}
              data-testid="button-quick-analysis"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Quick Micro-Fracture Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisMutation.isPending && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              AI Analysis in Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(agentConfig).map(([key, config]) => (
              <div key={key} className="flex items-start space-x-3 p-4 border rounded-lg">
                <div className={`p-2 rounded-full ${config.color} text-white`}>
                  <config.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{config.name}</h4>
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      Analyzing...
                    </Badge>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {responses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
              AI Analysis Results
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Multi-agent analysis completed. Review insights from each AI specialist.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {responses.map((response, index) => {
              const config = agentConfig[response.agentType];
              return (
                <div key={index} className="p-4 border rounded-lg space-y-3" data-testid={`ai-response-${response.agentType}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${config.color} text-white`}>
                        <config.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{config.name}</h4>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                      </div>
                    </div>
                    <Badge className={getConfidenceColor(response.confidence)}>
                      {response.confidence}% confidence
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm leading-relaxed">{response.content}</p>
                    </div>
                    
                    {response.reasoning && (
                      <details className="text-xs text-muted-foreground">
                        <summary className="cursor-pointer hover:text-foreground">
                          View reasoning
                        </summary>
                        <p className="mt-2 pl-4 border-l-2 border-muted">{response.reasoning}</p>
                      </details>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Case Summary for AI Context */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm">Patient Context Available to AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><span className="font-medium">Patient:</span> {caseData.patient.name}</div>
          <div><span className="font-medium">Age:</span> {caseData.patient.age} years</div>
          <div><span className="font-medium">Case Description:</span> {caseData.description || "Not recorded"}</div>
          <div><span className="font-medium">Case Status:</span> {caseData.status}</div>
          <div><span className="font-medium">Priority:</span> {caseData.priority}</div>
          <div><span className="font-medium">Vitals Records:</span> {caseData.vitals?.length || 0}</div>
          <div><span className="font-medium">Medical History:</span> {caseData.patient.medicalHistory || "None recorded"}</div>
          {caseData.patient.allergies && (
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />
              <span className="font-medium">Allergies:</span> {caseData.patient.allergies}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}