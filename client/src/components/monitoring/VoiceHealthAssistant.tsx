import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Brain, 
  MessageCircle,
  Activity,
  AlertTriangle,
  CheckCircle,
  Settings,
  Headphones,
  X,
  Send
} from 'lucide-react';
import { DailyInputForm } from '@/types/monitoring';

interface VoiceHealthAssistantProps {
  onHealthDataExtracted: (data: Partial<DailyInputForm>) => void;
  onClose?: () => void;
  initialData?: Partial<DailyInputForm>;
}

interface VoiceMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
}

interface VoiceStatus {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export function VoiceHealthAssistant({ 
  onHealthDataExtracted, 
  onClose,
  initialData = {}
}: VoiceHealthAssistantProps) {
  // State management
  const [status, setStatus] = useState<VoiceStatus>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    hasError: false
  });
  
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [extractedData, setExtractedData] = useState<Partial<DailyInputForm>>(initialData);
  const [apiKey, setApiKey] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  // Refs
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const conversationHistory = useRef<Array<{role: string, content: string}>>([]);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      recognitionRef.current = new (window as any).SpeechRecognition();
    } else {
      setStatus(prev => ({ 
        ...prev, 
        hasError: true, 
        errorMessage: 'Speech recognition not supported in this browser' 
      }));
      return;
    }

    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setStatus(prev => ({ ...prev, isListening: true, hasError: false }));
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setCurrentTranscript(finalTranscript + interimTranscript);

      if (finalTranscript.trim()) {
        processUserInput(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      setStatus(prev => ({ 
        ...prev, 
        hasError: true, 
        errorMessage: `Speech recognition error: ${event.error}`,
        isListening: false 
      }));
    };

    recognition.onend = () => {
      if (status.isListening) {
        // Auto-restart for continuous listening
        setTimeout(() => {
          if (recognitionRef.current && status.isListening) {
            recognitionRef.current.start();
          }
        }, 100);
      }
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
      synthesisRef.current.cancel();
    };
  }, []);

  // Auto-scroll chat area
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (isConfigured) {
      const greeting = "Hello! I'm your health assistant. Please tell me about your health today. You can mention your pain level, activities, or how you're feeling.";
      addMessage('assistant', greeting);
      if (!isMuted) {
        setTimeout(() => speakText(greeting), 500);
      }
    }
  }, [isConfigured, isMuted]);

  const startListening = () => {
    if (!isConfigured) {
      setStatus(prev => ({ 
        ...prev, 
        hasError: true, 
        errorMessage: 'Please configure your OpenAI API key first' 
      }));
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.start();
      setStatus(prev => ({ ...prev, isListening: true, hasError: false }));
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setStatus(prev => ({ ...prev, isListening: false }));
    setCurrentTranscript('');
  };

  const processUserInput = async (input: string) => {
    if (status.isProcessing || !input.trim()) return;

    setStatus(prev => ({ ...prev, isProcessing: true }));
    addMessage('user', input);
    
    try {
      const response = await callHealthAI(input);
      addMessage('assistant', response.message);
      
      // Extract and merge health data
      if (response.healthData) {
        const newData = { ...extractedData, ...response.healthData };
        setExtractedData(newData);
        onHealthDataExtracted(newData);
      }
      
      if (!isMuted) {
        speakText(response.message);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Processing failed';
      setStatus(prev => ({ 
        ...prev, 
        hasError: true, 
        errorMessage: errorMsg 
      }));
      addMessage('assistant', 'Sorry, I encountered an error processing your request. Please try again.');
    } finally {
      setStatus(prev => ({ ...prev, isProcessing: false }));
      setCurrentTranscript('');
    }
  };

  const callHealthAI = async (message: string): Promise<{
    message: string;
    healthData?: Partial<DailyInputForm>;
  }> => {
    const systemPrompt = `You are a healthcare assistant helping patients log their daily health status for monitoring recovery progress. 

    Extract relevant health information from user input and provide supportive, empathetic responses.
    
    Always respond with JSON in this exact format:
    {
      "message": "Your supportive response to the user (be encouraging and medical appropriate)",
      "healthData": {
        "painScore": number between 0-10 if mentioned,
        "painNote": "string describing pain location/type if mentioned",
        "gaitStable": boolean if walking/balance/stability mentioned,
        "limpingOrImbalance": boolean if limping/unsteady/balance issues mentioned,
        "activities": [
          {
            "type": "walking" | "exercise" | "rest" | "work" | "other",
            "duration": number in minutes if mentioned,
            "note": "brief description"
          }
        ]
      }
    }
    
    Guidelines:
    - Only include healthData fields that are explicitly mentioned
    - Be empathetic and encouraging
    - Ask follow-up questions to gather complete information
    - Remind users to consult healthcare professionals for serious concerns
    - If pain level increases significantly, suggest contacting a doctor`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.current.slice(-8), // Keep last 8 messages
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 400,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;
    
    // Update conversation history
    conversationHistory.current.push(
      { role: 'user', content: message },
      { role: 'assistant', content: assistantMessage }
    );
    
    try {
      const parsed = JSON.parse(assistantMessage);
      return {
        message: parsed.message || assistantMessage,
        healthData: parsed.healthData || {}
      };
    } catch {
      // Fallback if response is not JSON
      return { message: assistantMessage };
    }
  };

  const speakText = (text: string) => {
    if (isMuted) return;
    
    synthesisRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => {
      setStatus(prev => ({ ...prev, isSpeaking: true }));
    };
    
    utterance.onend = () => {
      setStatus(prev => ({ ...prev, isSpeaking: false }));
    };
    
    synthesisRef.current.speak(utterance);
  };

  const addMessage = (type: 'user' | 'assistant', content: string) => {
    const message: VoiceMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const clearConversation = () => {
    setMessages([]);
    conversationHistory.current = [];
    setExtractedData(initialData);
    setCurrentTranscript('');
    synthesisRef.current.cancel();
    onHealthDataExtracted(initialData);
  };

  const getStatusColor = () => {
    if (status.hasError) return 'text-red-600';
    if (status.isSpeaking) return 'text-purple-600';
    if (status.isProcessing) return 'text-blue-600';
    if (status.isListening) return 'text-green-600';
    return 'text-gray-600';
  };

  const getStatusText = () => {
    if (status.hasError) return status.errorMessage || 'Error';
    if (status.isSpeaking) return 'Speaking...';
    if (status.isProcessing) return 'Processing...';
    if (status.isListening) return 'Listening...';
    return 'Ready';
  };

  const getStatusDot = () => {
    if (status.hasError) return 'bg-red-500';
    if (status.isSpeaking) return 'bg-purple-500';
    if (status.isProcessing) return 'bg-blue-500';
    if (status.isListening) return 'bg-green-500';
    return 'bg-gray-400';
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Voice Health Assistant</h2>
              <p className="text-sm text-gray-600">Speak naturally about your health</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
              <div className={`w-3 h-3 rounded-full animate-pulse ${getStatusDot()}`} />
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* API Configuration */}
        {!isConfigured && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-900 mb-2">Configure OpenAI API</h4>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Enter your OpenAI API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => setIsConfigured(true)}
                    disabled={!apiKey.trim()}
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-6 overflow-y-auto" ref={chatAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}>
              {message.type === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg">
                  🏥
                </div>
              )}
              
              <div className={`max-w-[70%] ${message.type === 'user' ? 'order-first' : ''}`}>
                <div className={`p-4 rounded-2xl shadow-sm ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto' 
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className={`text-xs mt-2 block ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg">
                  👤
                </div>
              )}
            </div>
          ))}

          {/* Current Transcript */}
          {currentTranscript && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Mic className="w-4 h-4 text-yellow-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-1">Listening...</p>
                  <p className="text-sm text-yellow-700 font-mono">{currentTranscript}</p>
                </div>
              </div>
            </div>
          )}

          {/* Extracted Health Data Preview */}
          {Object.keys(extractedData).length > 0 && (
            <Card className="border-green-200 bg-green-50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-green-800 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Extracted Health Data
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {extractedData.painScore !== undefined && (
                    <div className="flex justify-between items-center p-2 bg-white rounded border">
                      <span className="text-green-700 font-medium">Pain Score:</span>
                      <Badge variant="outline" className="text-green-800 border-green-300">
                        {extractedData.painScore}/10
                      </Badge>
                    </div>
                  )}
                  {extractedData.gaitStable !== undefined && (
                    <div className="flex justify-between items-center p-2 bg-white rounded border">
                      <span className="text-green-700 font-medium">Gait Stable:</span>
                      <Badge variant={extractedData.gaitStable ? "default" : "destructive"}>
                        {extractedData.gaitStable ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  )}
                  {extractedData.painNote && (
                    <div className="md:col-span-2 p-2 bg-white rounded border">
                      <span className="text-green-700 font-medium">Pain Note:</span>
                      <p className="text-green-600 text-xs mt-1">{extractedData.painNote}</p>
                    </div>
                  )}
                  {extractedData.activities && extractedData.activities.length > 0 && (
                    <div className="md:col-span-2 p-2 bg-white rounded border">
                      <span className="text-green-700 font-medium">Activities:</span>
                      <div className="mt-1 space-y-1">
                        {extractedData.activities.map((activity, index) => (
                          <div key={index} className="text-xs text-green-600 flex justify-between">
                            <span>{activity.type}: {activity.duration} minutes</span>
                            {activity.note && <span className="italic">({activity.note})</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {status.hasError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {status.errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-white border-t border-gray-200">
        <div className="flex flex-col items-center gap-4 max-w-4xl mx-auto">
          {/* Main Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={status.isListening ? stopListening : startListening}
              disabled={status.isProcessing || status.hasError || !isConfigured}
              size="lg"
              className={`${
                status.isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              } text-white px-8 py-3 shadow-lg`}
            >
              {status.isListening ? (
                <>
                  <MicOff className="w-5 h-5 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Start Listening
                </>
              )}
            </Button>

            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant="outline"
              size="lg"
              className="px-6 py-3"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-5 h-5 mr-2" />
                  Unmute
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 mr-2" />
                  Mute
                </>
              )}
            </Button>

            <Button
              onClick={clearConversation}
              variant="outline"
              size="lg"
              className="px-6 py-3"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Clear
            </Button>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Try saying:</span>
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-50">
              "My pain level is 3 today"
            </Badge>
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-50">
              "I walked for 30 minutes"
            </Badge>
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-50">
              "I'm feeling better"
            </Badge>
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-50">
              "My walking is unsteady"
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
