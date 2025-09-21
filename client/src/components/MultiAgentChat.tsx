import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Send,
  Brain,
  Stethoscope,
  FileText,
  Bot,
  User,
  Loader2,
  MessageCircle,
  Star,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  EnhancedMessage,
  RubricEvaluation,
  AgentPerformance,
  MultiAgentChatProps,
  ENHANCED_AGENT_CONFIG,
  MICRO_FRACTURE_RUBRIC,
} from "@/types/agentChat";

// 评分组件
function RubricScoreDisplay({ evaluation }: { evaluation: RubricEvaluation }) {
  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < score ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getEthicsIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "risk":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <BarChart3 className="w-4 h-4 text-yellow-600" />
        <span className="text-sm font-medium text-yellow-800">
          Clinical Rubric Evaluation
        </span>
        <Badge variant="secondary" className="text-xs">
          Score: {evaluation.totalScore}/100
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span>Diagnostic Accuracy</span>
            <div className="flex">
              {renderStars(evaluation.scores.diagnosticAccuracy)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Consultation Logic</span>
            <div className="flex">
              {renderStars(evaluation.scores.consultationLogic)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Treatment Plan</span>
            <div className="flex">
              {renderStars(evaluation.scores.treatmentPlan)}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span>Empathy Skills</span>
            <div className="flex">
              {renderStars(evaluation.scores.empathySkills)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Ethics</span>
            {getEthicsIcon(evaluation.scores.ethicsCompliance)}
          </div>
        </div>
      </div>

      {evaluation.feedback.improvements.length > 0 && (
        <div className="mt-2 pt-2 border-t border-yellow-300">
          <p className="text-xs text-yellow-700 font-medium">Improvements:</p>
          <ul className="text-xs text-yellow-600 mt-1">
            {evaluation.feedback.improvements.map((improvement, index) => (
              <li key={index}>• {improvement}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// 性能趋势组件
function AgentPerformancePanel({
  performances,
}: {
  performances: AgentPerformance[];
}) {
  const getIconComponent = (agentType: string) => {
    switch (agentType) {
      case "diagnostician":
        return <Brain className="w-4 h-4" />;
      case "radiologist":
        return <FileText className="w-4 h-4" />;
      case "treatment_planner":
        return <Stethoscope className="w-4 h-4" />;
      case "orchestrator":
        return <Bot className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Agent Performance Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {performances.map((perf) => (
          <div key={perf.agentType} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                {getIconComponent(perf.agentType)}
                <span className="font-medium">
                  {ENHANCED_AGENT_CONFIG[perf.agentType]?.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    perf.improvementTrend === "improving"
                      ? "default"
                      : "secondary"
                  }
                >
                  {perf.averageScore.toFixed(1)}/100
                </Badge>
                <TrendingUp
                  className={`w-3 h-3 ${
                    perf.improvementTrend === "improving"
                      ? "text-green-500"
                      : perf.improvementTrend === "declining"
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                />
              </div>
            </div>
            <Progress value={perf.averageScore} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {perf.totalInteractions} interactions • Last updated:{" "}
              {perf.lastUpdated.toLocaleDateString()}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function MultiAgentChat({ caseId, patientName }: MultiAgentChatProps) {
  const [messages, setMessages] = useState<EnhancedMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPerformancePanel, setShowPerformancePanel] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 模拟的Agent性能数据
  const [agentPerformances] = useState<AgentPerformance[]>([
    {
      agentType: "diagnostician",
      averageScore: 87.5,
      totalInteractions: 45,
      improvementTrend: "improving",
      lastUpdated: new Date(),
    },
    {
      agentType: "radiologist",
      averageScore: 92.3,
      totalInteractions: 38,
      improvementTrend: "stable",
      lastUpdated: new Date(),
    },
    {
      agentType: "treatment_planner",
      averageScore: 89.1,
      totalInteractions: 42,
      improvementTrend: "improving",
      lastUpdated: new Date(),
    },
  ]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  // 模拟Rubric评估
  const generateRubricEvaluation = (
    message: EnhancedMessage
  ): RubricEvaluation => {
    const baseScore = Math.floor(Math.random() * 20) + 80; // 80-100 range

    return {
      id: `eval-${Date.now()}`,
      messageId: message.id,
      agentType: message.agentType!,
      scores: {
        diagnosticAccuracy: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        consultationLogic: Math.floor(Math.random() * 2) + 3, // 3-4 stars
        treatmentPlan: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        empathySkills: Math.floor(Math.random() * 2) + 3, // 3-4 stars
        ethicsCompliance: Math.random() > 0.1 ? "compliant" : "warning",
      },
      totalScore: baseScore,
      feedback: {
        strengths: [
          "Clear diagnostic reasoning",
          "Comprehensive treatment approach",
          "Good use of clinical guidelines",
        ],
        improvements: [
          "Could ask more follow-up questions",
          "Consider patient's emotional state",
          "Provide more specific timeline",
        ],
        recommendations: [
          "Continue current approach",
          "Enhance patient communication",
          "Consider additional risk factors",
        ],
      },
      timestamp: new Date(),
    };
  };

  const simulateAgentResponse = async (userQuery: string) => {
    setIsProcessing(true);

    // 1. Orchestrator 协调
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const orchestratorMsg: EnhancedMessage = {
      id: `msg-${Date.now()}-orchestrator`,
      type: "agent",
      agentType: "orchestrator",
      agentName: ENHANCED_AGENT_CONFIG.orchestrator.name,
      content: `Analyzing your query: "${userQuery}". Coordinating with specialist agents for comprehensive analysis...`,
      timestamp: new Date(),
      confidence: 95,
      isEvaluated: false,
    };
    setMessages((prev) => [...prev, orchestratorMsg]);

    // 2. Diagnostician 分析
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const diagnosticianMsg: EnhancedMessage = {
      id: `msg-${Date.now()}-diagnostician`,
      type: "agent",
      agentType: "diagnostician",
      agentName: ENHANCED_AGENT_CONFIG.diagnostician.name,
      content: `Based on the patient symptoms and available data, I'm analyzing potential minimal trauma fracture patterns. The clinical presentation suggests stress-related bone changes in the affected area. I recommend considering the patient's age, activity level, and pain characteristics for differential diagnosis.`,
      timestamp: new Date(),
      confidence: 87,
      isEvaluated: false,
    };
    setMessages((prev) => [...prev, diagnosticianMsg]);

    // 3. Radiologist 分析
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const radiologistMsg: EnhancedMessage = {
      id: `msg-${Date.now()}-radiologist`,
      type: "agent",
      agentType: "radiologist",
      agentName: ENHANCED_AGENT_CONFIG.radiologist.name,
      content: `Imaging analysis reveals subtle density changes consistent with early-stage minimal trauma fracture development. Bone architecture shows minor disruption patterns. I recommend X-ray as initial imaging, with MRI if X-ray is negative but clinical suspicion remains high.`,
      timestamp: new Date(),
      confidence: 91,
      isEvaluated: false,
    };
    setMessages((prev) => [...prev, radiologistMsg]);

    // 4. Treatment Planner 建议
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const treatmentMsg: EnhancedMessage = {
      id: `msg-${Date.now()}-treatment`,
      type: "agent",
      agentType: "treatment_planner",
      agentName: ENHANCED_AGENT_CONFIG.treatment_planner.name,
      content: `Treatment recommendations: 1) Immediate load reduction and rest protocol for 4-6 weeks, 2) Anti-inflammatory management with NSAIDs, 3) Physical therapy consultation for gradual return to activity, 4) Follow-up imaging in 2-3 weeks. Consider calcium and vitamin D supplementation based on patient history.`,
      timestamp: new Date(),
      confidence: 93,
      isEvaluated: false,
    };
    setMessages((prev) => [...prev, treatmentMsg]);

    // 5. Rubric Evaluator 评估
    await new Promise((resolve) => setTimeout(resolve, 800));
    const evaluatorMsg: EnhancedMessage = {
      id: `msg-${Date.now()}-evaluator`,
      type: "agent",
      agentType: "rubric_evaluator",
      agentName: ENHANCED_AGENT_CONFIG.rubric_evaluator.name,
      content: `Clinical performance evaluation completed. I've assessed each agent's response for diagnostic accuracy, consultation logic, treatment planning, empathy, and ethical compliance. Overall session score: 89/100. See detailed feedback below.`,
      timestamp: new Date(),
      confidence: 98,
      isEvaluated: false,
    };
    setMessages((prev) => [...prev, evaluatorMsg]);

    // 6. 为每个Agent消息生成评估
    const messagesToEvaluate = [diagnosticianMsg, radiologistMsg, treatmentMsg];
    for (const msg of messagesToEvaluate) {
      const evaluation = generateRubricEvaluation(msg);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id ? { ...m, evaluation, isEvaluated: true } : m
        )
      );
    }

    setIsProcessing(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: EnhancedMessage = {
      id: `msg-${Date.now()}-user`,
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
      isEvaluated: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    await simulateAgentResponse(inputValue.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="space-y-4">
      <Card
        className="h-[600px] flex flex-col"
        data-testid="card-multi-agent-chat"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <MessageCircle className="w-5 h-5 mr-2" />
              Enhanced Multi-Agent Consultation
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPerformancePanel(!showPerformancePanel)}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Performance
              </Button>
              {(caseId || patientName) && (
                <div className="text-right">
                  <p
                    className="text-sm font-medium"
                    data-testid="text-chat-patient"
                  >
                    {patientName || "Patient"}
                  </p>
                  {caseId && (
                    <p className="text-xs text-muted-foreground">
                      Case: {caseId}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <Separator />
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4">
          {/* Messages */}
          <ScrollArea
            className="flex-1"
            ref={scrollAreaRef}
            data-testid="scroll-messages"
          >
            <div className="space-y-4 pr-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Start a conversation with our AI agents</p>
                  <p className="text-xs mt-1">
                    Ask about symptoms, diagnosis, or treatment options
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.type === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                    data-testid={`message-${message.id}`}
                  >
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback
                        className={
                          message.type === "user"
                            ? "bg-primary/10 text-primary"
                            : ENHANCED_AGENT_CONFIG[message.agentType!]
                                ?.color || "bg-muted"
                        }
                      >
                        {message.type === "user" ? (
                          <User className="w-4 h-4" />
                        ) : (
                          (() => {
                            const iconName =
                              ENHANCED_AGENT_CONFIG[message.agentType!]?.icon;
                            switch (iconName) {
                              case "Brain":
                                return <Brain className="w-4 h-4" />;
                              case "FileText":
                                return <FileText className="w-4 h-4" />;
                              case "Stethoscope":
                                return <Stethoscope className="w-4 h-4" />;
                              case "BarChart3":
                                return <BarChart3 className="w-4 h-4" />;
                              default:
                                return <Bot className="w-4 h-4" />;
                            }
                          })()
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`flex-1 space-y-1 ${
                        message.type === "user" ? "text-right" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {message.type === "user" ? (
                          <span className="text-sm font-medium">You</span>
                        ) : (
                          <>
                            <span
                              className="text-sm font-medium"
                              data-testid={`agent-name-${message.agentType}`}
                            >
                              {message.agentName}
                            </span>
                            {message.confidence && (
                              <Badge
                                variant="secondary"
                                className="text-xs"
                                data-testid={`confidence-${message.id}`}
                              >
                                {message.confidence}%
                              </Badge>
                            )}
                            {message.isEvaluated && message.evaluation && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-yellow-50 text-yellow-700"
                              >
                                Evaluated
                              </Badge>
                            )}
                          </>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground ml-8"
                            : "bg-muted mr-8"
                        }`}
                        data-testid={`message-content-${message.id}`}
                      >
                        {message.content}
                      </div>

                      {/* 显示评估结果 */}
                      {message.evaluation && (
                        <RubricScoreDisplay evaluation={message.evaluation} />
                      )}
                    </div>
                  </div>
                ))
              )}

              {isProcessing && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI agents are analyzing...</span>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex items-center space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about symptoms, diagnosis, or treatment..."
              disabled={isProcessing}
              data-testid="input-chat-message"
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
              size="icon"
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 性能面板 */}
      {showPerformancePanel && (
        <AgentPerformancePanel performances={agentPerformances} />
      )}
    </div>
  );
}
