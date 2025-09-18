import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  Brain, 
  Stethoscope, 
  FileText, 
  Bot,
  User,
  Loader2,
  MessageCircle
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'agent';
  agentType?: 'diagnostician' | 'radiologist' | 'treatment_planner' | 'orchestrator';
  agentName?: string;
  content: string;
  timestamp: Date;
  confidence?: number;
}

interface MultiAgentChatProps {
  caseId?: string;
  patientName?: string;
}

const agentConfig = {
  orchestrator: {
    name: "HealthAI Orchestrator",
    icon: Bot,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    role: "Coordinates multi-agent analysis"
  },
  diagnostician: {
    name: "Dr. Neural",
    icon: Brain,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    role: "Primary diagnostic analysis"
  },
  radiologist: {
    name: "RadiologyAI",
    icon: FileText,
    color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    role: "Medical imaging specialist"
  },
  treatment_planner: {
    name: "TreatmentBot",
    icon: Stethoscope,
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    role: "Treatment planning and recommendations"
  }
};

export function MultiAgentChat({ caseId, patientName }: MultiAgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const simulateAgentResponse = async (userQuery: string) => {
    setIsProcessing(true);

    // Orchestrator response first
    await new Promise(resolve => setTimeout(resolve, 1000));
    const orchestratorMsg: Message = {
      id: `msg-${Date.now()}-orchestrator`,
      type: 'agent',
      agentType: 'orchestrator',
      agentName: agentConfig.orchestrator.name,
      content: `Analyzing your query: "${userQuery}". Coordinating with specialist agents for comprehensive analysis...`,
      timestamp: new Date(),
      confidence: 95
    };
    setMessages(prev => [...prev, orchestratorMsg]);

    // Diagnostician analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    const diagnosticianMsg: Message = {
      id: `msg-${Date.now()}-diagnostician`,
      type: 'agent',
      agentType: 'diagnostician', 
      agentName: agentConfig.diagnostician.name,
      content: `Based on the patient symptoms and available data, I'm analyzing potential micro-fracture patterns. The clinical presentation suggests stress-related bone changes in the affected area. Confidence level is high for initial assessment.`,
      timestamp: new Date(),
      confidence: 87
    };
    setMessages(prev => [...prev, diagnosticianMsg]);

    // Radiologist analysis
    await new Promise(resolve => setTimeout(resolve, 1200));
    const radiologistMsg: Message = {
      id: `msg-${Date.now()}-radiologist`,
      type: 'agent',
      agentType: 'radiologist',
      agentName: agentConfig.radiologist.name,
      content: `Imaging analysis reveals subtle density changes consistent with early-stage micro-fracture development. Bone architecture shows minor disruption patterns. Recommend additional imaging with enhanced resolution for confirmation.`,
      timestamp: new Date(),
      confidence: 91
    };
    setMessages(prev => [...prev, radiologistMsg]);

    // Treatment planner suggestions
    await new Promise(resolve => setTimeout(resolve, 1000));
    const treatmentMsg: Message = {
      id: `msg-${Date.now()}-treatment`,
      type: 'agent',
      agentType: 'treatment_planner',
      agentName: agentConfig.treatment_planner.name,
      content: `Treatment recommendations: 1) Immediate load reduction and rest protocol, 2) Anti-inflammatory management, 3) Physical therapy consultation, 4) Follow-up imaging in 2-3 weeks. Consider calcium and vitamin D supplementation based on patient history.`,
      timestamp: new Date(),
      confidence: 93
    };
    setMessages(prev => [...prev, treatmentMsg]);

    // Final orchestrator summary
    await new Promise(resolve => setTimeout(resolve, 800));
    const summaryMsg: Message = {
      id: `msg-${Date.now()}-summary`,
      type: 'agent',
      agentType: 'orchestrator',
      agentName: agentConfig.orchestrator.name,
      content: `**Multi-Agent Analysis Summary:** All specialist agents concur on probable micro-fracture diagnosis. Combined confidence: 90.3%. Recommended immediate action: implement conservative treatment protocol with close monitoring. Would you like me to generate a detailed treatment plan or explore any specific aspect further?`,
      timestamp: new Date(),
      confidence: 90
    };
    setMessages(prev => [...prev, summaryMsg]);

    setIsProcessing(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    await simulateAgentResponse(inputValue.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <Card className="h-[600px] flex flex-col" data-testid="card-multi-agent-chat">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <MessageCircle className="w-5 h-5 mr-2" />
            Multi-Agent Consultation
          </CardTitle>
          {(caseId || patientName) && (
            <div className="text-right">
              <p className="text-sm font-medium" data-testid="text-chat-patient">
                {patientName || "Patient"}
              </p>
              {caseId && (
                <p className="text-xs text-muted-foreground">Case: {caseId}</p>
              )}
            </div>
          )}
        </div>
        <Separator />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages */}
        <ScrollArea className="flex-1" ref={scrollAreaRef} data-testid="scroll-messages">
          <div className="space-y-4 pr-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Start a conversation with our AI agents</p>
                <p className="text-xs mt-1">Ask about symptoms, diagnosis, or treatment options</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                  data-testid={`message-${message.id}`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback 
                      className={
                        message.type === 'user' 
                          ? "bg-primary/10 text-primary" 
                          : agentConfig[message.agentType!]?.color || "bg-muted"
                      }
                    >
                      {message.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        (() => {
                          const IconComponent = agentConfig[message.agentType!]?.icon || Bot;
                          return <IconComponent className="w-4 h-4" />;
                        })()
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div className={`flex-1 space-y-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className="flex items-center space-x-2">
                      {message.type === 'user' ? (
                        <span className="text-sm font-medium">You</span>
                      ) : (
                        <>
                          <span className="text-sm font-medium" data-testid={`agent-name-${message.agentType}`}>
                            {message.agentName}
                          </span>
                          {message.confidence && (
                            <Badge variant="secondary" className="text-xs" data-testid={`confidence-${message.id}`}>
                              {message.confidence}%
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
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground ml-8'
                          : 'bg-muted mr-8'
                      }`}
                      data-testid={`message-content-${message.id}`}
                    >
                      {message.content}
                    </div>
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
  );
}