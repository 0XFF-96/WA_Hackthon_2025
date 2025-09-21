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
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [showDemoConversation, setShowDemoConversation] = useState(true);

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

  // Initial greeting and demo conversation
  useEffect(() => {
    if (isConfigured && showDemoConversation) {
      // Add demo conversation for testing
      const demoConversation = [
        {
          type: 'assistant' as const,
          content: "Hello! I'm your health assistant. Please tell me about your health today. You can mention your pain level, activities, or how you're feeling."
        },
        {
          type: 'user' as const,
          content: "Hi there! My pain level is about 4 out of 10 today, mostly in my lower back."
        },
        {
          type: 'assistant' as const,
          content: "I've recorded your pain level as 4 out of 10 with lower back pain. That sounds manageable but I understand it can still be uncomfortable. Have you been able to do any activities today?"
        },
        {
          type: 'user' as const,
          content: "Yes, I walked for about 30 minutes this morning and did some light stretching for 15 minutes."
        },
        {
          type: 'assistant' as const,
          content: "Excellent! I've logged your walking for 30 minutes and stretching for 15 minutes. That's great that you're staying active despite the discomfort. How has your walking been? Any issues with balance or stability?"
        },
        {
          type: 'user' as const,
          content: "My walking feels pretty stable today. No limping or balance issues."
        },
        {
          type: 'assistant' as const,
          content: "Perfect! I've recorded that your gait is stable with no balance issues. It sounds like you're managing well today. Is there anything else about your health you'd like me to record?"
        },
        {
          type: 'user' as const,
          content: "I think that covers everything for today. Thank you!"
        },
        {
          type: 'assistant' as const,
          content: "You're welcome! I've successfully logged all your health data for today. Keep up the good work with staying active, and please don't hesitate to reach out if your pain increases or if you have any concerns."
        }
      ];

      // Add demo messages with some delay for realism
      setTimeout(() => {
        demoConversation.forEach((msg, index) => {
          setTimeout(() => {
            addMessage(msg.type, msg.content);
            
            // Extract data from user messages for demo
            if (msg.type === 'user') {
              const extractedData = extractHealthDataFromText(msg.content);
              if (Object.keys(extractedData).length > 0) {
                setExtractedData(prev => ({ ...prev, ...extractedData }));
                onHealthDataExtracted({ ...extractedData });
              }
            }
          }, index * 800); // Stagger messages
        });

        // Speak the greeting after demo is loaded
        if (!isMuted) {
          setTimeout(() => {
            speakText("Demo conversation loaded. You can now start speaking to log your real health data, or clear the conversation to start fresh.");
          }, demoConversation.length * 800 + 1000);
        }
      }, 500);
    } else if (isConfigured && !showDemoConversation) {
      // Just add the greeting without demo
      const greeting = "Hello! I'm your health assistant. Please tell me about your health today. You can mention your pain level, activities, or how you're feeling.";
      addMessage('assistant', greeting);
      if (!isMuted) {
        setTimeout(() => speakText(greeting), 500);
      }
    }
  }, [isConfigured, isMuted, showDemoConversation]);

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

  const validateApiKey = (key: string): boolean => {
    // OpenAI API keys should start with 'sk-' and be at least 20 characters
    return key.startsWith('sk-') && key.length >= 20;
  };

  const testApiConnection = async (): Promise<boolean> => {
    if (!validateApiKey(apiKey)) {
      throw new Error('Invalid API key format');
    }

    setIsTestingApi(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // Use cheaper model for testing
          messages: [{ role: 'user', content: 'Test connection' }],
          max_tokens: 5
        })
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        switch (response.status) {
          case 401:
            throw new Error('Invalid API key. Please check your OpenAI API key.');
          case 403:
            throw new Error('API access forbidden. Your account may have issues or insufficient credits.');
          case 429:
            throw new Error('Rate limit exceeded. Please try again later.');
          default:
            throw new Error(`API test failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('API test error:', error);
      throw error;
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleConfigureApi = async () => {
    try {
      await testApiConnection();
      setIsConfigured(true);
      addMessage('assistant', 'Great! Your API key is working. I\'m ready to help you log your health data. Please tell me about your health today.');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'API test failed';
      setStatus(prev => ({ 
        ...prev, 
        hasError: true, 
        errorMessage: errorMsg 
      }));
    }
  };

  const extractHealthDataFromText = (text: string): Partial<DailyInputForm> => {
    const lowerText = text.toLowerCase();
    const healthData: Partial<DailyInputForm> = {};

    // Extract pain score (0-10)
    const painPatterns = [
      /pain.*?(\d+)/,
      /(\d+).*?pain/,
      /hurt.*?(\d+)/,
      /(\d+).*?hurt/,
      /score.*?(\d+)/,
      /level.*?(\d+)/,
      /(\d+).*?out of 10/,
      /(\d+)\/10/
    ];

    for (const pattern of painPatterns) {
      const match = lowerText.match(pattern);
      if (match) {
        const score = parseInt(match[1]);
        if (score >= 0 && score <= 10) {
          healthData.painScore = score;
          break;
        }
      }
    }

    // Extract pain location/note
    const bodyParts = ['back', 'knee', 'shoulder', 'hip', 'neck', 'ankle', 'wrist', 'head', 'chest', 'stomach'];
    const painDescriptions = [];
    
    for (const part of bodyParts) {
      if (lowerText.includes(part)) {
        painDescriptions.push(part);
      }
    }
    
    if (painDescriptions.length > 0) {
      healthData.painNote = `${painDescriptions.join(', ')} pain`;
    }

    // Extract gait stability
    const stableKeywords = ['stable', 'steady', 'good balance', 'walking well', 'no problems walking'];
    const unstableKeywords = ['unstable', 'unsteady', 'wobbl', 'imbalance', 'limp', 'difficult walking', 'trouble walking'];

    const hasStableKeywords = stableKeywords.some(keyword => lowerText.includes(keyword));
    const hasUnstableKeywords = unstableKeywords.some(keyword => lowerText.includes(keyword));

    if (hasStableKeywords && !hasUnstableKeywords) {
      healthData.gaitStable = true;
      healthData.limpingOrImbalance = false;
    } else if (hasUnstableKeywords) {
      healthData.gaitStable = false;
      healthData.limpingOrImbalance = true;
    }

    // Extract activities
    const activities = [];
    
    // Walking
    const walkMatches = lowerText.match(/walk.*?(\d+).*?minute|(\d+).*?minute.*?walk/);
    if (walkMatches) {
      const duration = parseInt(walkMatches[1] || walkMatches[2]);
      if (duration > 0 && duration <= 480) {
        activities.push({
          type: 'walking' as const,
          duration,
          note: 'Voice logged walking'
        });
      }
    }

    // Exercise
    const exerciseMatches = lowerText.match(/exercise.*?(\d+).*?minute|(\d+).*?minute.*?exercise|workout.*?(\d+).*?minute/);
    if (exerciseMatches) {
      const duration = parseInt(exerciseMatches[1] || exerciseMatches[2] || exerciseMatches[3]);
      if (duration > 0 && duration <= 480) {
        activities.push({
          type: 'exercise' as const,
          duration,
          note: 'Voice logged exercise'
        });
      }
    }

    // Rest
    const restMatches = lowerText.match(/rest.*?(\d+).*?minute|(\d+).*?minute.*?rest|sleep.*?(\d+).*?hour/);
    if (restMatches) {
      let duration = parseInt(restMatches[1] || restMatches[2] || restMatches[3]);
      if (restMatches[3]) duration *= 60; // Convert hours to minutes
      if (duration > 0 && duration <= 720) {
        activities.push({
          type: 'rest' as const,
          duration,
          note: 'Voice logged rest'
        });
      }
    }

    if (activities.length > 0) {
      healthData.activities = activities;
    }

    return healthData;
  };

  const generateSimpleResponse = (extractedData: Partial<DailyInputForm>): string => {
    const responses = [];
    
    if (extractedData.painScore !== undefined) {
      responses.push(`I've recorded your pain level as ${extractedData.painScore} out of 10.`);
    }
    
    if (extractedData.painNote) {
      responses.push(`I noted your ${extractedData.painNote}.`);
    }
    
    if (extractedData.gaitStable !== undefined) {
      responses.push(extractedData.gaitStable 
        ? "I've recorded that your walking is stable." 
        : "I've noted that you're experiencing some walking difficulties."
      );
    }
    
    if (extractedData.activities && extractedData.activities.length > 0) {
      const activitySummary = extractedData.activities.map(a => 
        `${a.duration} minutes of ${a.type}`
      ).join(', ');
      responses.push(`I've logged your activities: ${activitySummary}.`);
    }
    
    if (responses.length === 0) {
      return "I'm listening. Please tell me about your pain level, activities, or how you're feeling today.";
    }
    
    responses.push("Is there anything else you'd like to record?");
    return responses.join(' ');
  };

  const callHealthAI = async (message: string): Promise<{
    message: string;
    healthData?: Partial<DailyInputForm>;
  }> => {
    // If no valid API key, use simple rule-based extraction
    if (!apiKey || !validateApiKey(apiKey)) {
      const extractedData = extractHealthDataFromText(message);
      const response = generateSimpleResponse(extractedData);
      return {
        message: response,
        healthData: extractedData
      };
    }

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

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`, // Trim whitespace
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
        const errorData = await response.json().catch(() => ({}));
        
        // Handle different error statuses
        switch (response.status) {
          case 401:
            throw new Error('Invalid API key. Please check your OpenAI API key and make sure it\'s valid and active.');
          case 403:
            throw new Error('API access forbidden. Your API key may not have access to GPT-4 or your account may have issues.');
          case 429:
            throw new Error('Rate limit exceeded. Please wait a moment and try again.');
          case 500:
            throw new Error('OpenAI server error. Please try again in a moment.');
          default:
            throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response received from OpenAI API');
      }

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
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
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

  const loadDemoConversation = () => {
    clearConversation();
    
    const demoConversation = [
      {
        type: 'assistant' as const,
        content: "Hello! I'm your health assistant. Please tell me about your health today. You can mention your pain level, activities, or how you're feeling."
      },
      {
        type: 'user' as const,
        content: "Hi there! My pain level is about 4 out of 10 today, mostly in my lower back."
      },
      {
        type: 'assistant' as const,
        content: "I've recorded your pain level as 4 out of 10 with lower back pain. That sounds manageable but I understand it can still be uncomfortable. Have you been able to do any activities today?"
      },
      {
        type: 'user' as const,
        content: "Yes, I walked for about 30 minutes this morning and did some light stretching for 15 minutes."
      },
      {
        type: 'assistant' as const,
        content: "Excellent! I've logged your walking for 30 minutes and stretching for 15 minutes. That's great that you're staying active despite the discomfort. How has your walking been? Any issues with balance or stability?"
      },
      {
        type: 'user' as const,
        content: "My walking feels pretty stable today. No limping or balance issues."
      },
      {
        type: 'assistant' as const,
        content: "Perfect! I've recorded that your gait is stable with no balance issues. It sounds like you're managing well today. Is there anything else about your health you'd like me to record?"
      },
      {
        type: 'user' as const,
        content: "I think that covers everything for today. Thank you!"
      },
      {
        type: 'assistant' as const,
        content: "You're welcome! I've successfully logged all your health data for today. Keep up the good work with staying active, and please don't hesitate to reach out if your pain increases or if you have any concerns."
      }
    ];

    // Add demo messages with some delay for realism
    setTimeout(() => {
      demoConversation.forEach((msg, index) => {
        setTimeout(() => {
          addMessage(msg.type, msg.content);
          
          // Extract data from user messages for demo
          if (msg.type === 'user') {
            const extractedData = extractHealthDataFromText(msg.content);
            if (Object.keys(extractedData).length > 0) {
              setExtractedData(prev => ({ ...prev, ...extractedData }));
              onHealthDataExtracted({ ...extractedData });
            }
          }
        }, index * 600); // Slightly faster for manual loading
      });

      // Speak completion message
      if (!isMuted) {
        setTimeout(() => {
          speakText("Demo conversation loaded successfully! You can now see how health data extraction works.");
        }, demoConversation.length * 600 + 500);
      }
    }, 100);
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
                <h4 className="font-medium text-amber-900 mb-2">Configure OpenAI API Key</h4>
                <p className="text-sm text-amber-800 mb-3">
                  You need a valid OpenAI API key to use the voice assistant. Your API key should start with "sk-" and be at least 20 characters long.
                </p>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className={`flex-1 ${
                        apiKey && !validateApiKey(apiKey) 
                          ? 'border-red-300 focus:border-red-500' 
                          : ''
                      }`}
                    />
                    <Button 
                      onClick={handleConfigureApi}
                      disabled={!apiKey.trim() || !validateApiKey(apiKey) || isTestingApi}
                      size="sm"
                    >
                      {isTestingApi ? (
                        <>
                          <div className="animate-spin w-4 h-4 mr-1 border-2 border-white border-t-transparent rounded-full" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Test & Configure
                        </>
                      )}
                    </Button>
                  </div>
                  {apiKey && !validateApiKey(apiKey) && (
                    <p className="text-xs text-red-600">
                      ⚠️ Invalid API key format. OpenAI keys should start with "sk-" and be at least 20 characters.
                    </p>
                  )}
                  <div className="text-xs text-amber-700">
                    <p>💡 <strong>How to get an API key:</strong></p>
                    <ol className="list-decimal list-inside mt-1 space-y-1">
                      <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/api-keys</a></li>
                      <li>Sign in to your OpenAI account</li>
                      <li>Click "Create new secret key"</li>
                      <li>Copy the key and paste it here</li>
                    </ol>
                  </div>
                  <div className="mt-3 pt-3 border-t border-amber-300">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="showDemo"
                          checked={showDemoConversation}
                          onChange={(e) => setShowDemoConversation(e.target.checked)}
                          className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                        />
                        <label htmlFor="showDemo" className="text-xs text-amber-700">
                          Load demo conversation for testing
                        </label>
                      </div>
                      <Button 
                        onClick={() => setIsConfigured(true)}
                        variant="outline"
                        size="sm"
                        className="w-full text-amber-700 border-amber-300 hover:bg-amber-100"
                      >
                        Skip AI - Use Basic Voice Recognition
                      </Button>
                      <p className="text-xs text-amber-600 text-center">
                        Continue with simple voice recognition (limited features)
                      </p>
                    </div>
                  </div>
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

            <Button
              onClick={loadDemoConversation}
              variant="outline"
              size="lg"
              className="px-6 py-3 border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Brain className="w-5 h-5 mr-2" />
              Load Demo
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
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-50">
              "My knee hurts 6 out of 10"
            </Badge>
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-50">
              "I exercised for 45 minutes"
            </Badge>
          </div>
          
          {/* Demo Scenarios */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-2">💡 Demo Scenarios Available:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <div className="text-blue-700">
                <strong>Basic Health Log:</strong><br/>
                Pain: 4/10 (lower back)<br/>
                Activities: Walking, stretching<br/>
                Gait: Stable
              </div>
              <div className="text-blue-700">
                <strong>Recovery Progress:</strong><br/>
                Pain improvement noted<br/>
                Increased activity<br/>
                Better mobility
              </div>
              <div className="text-blue-700">
                <strong>Pain Management:</strong><br/>
                Multiple pain locations<br/>
                Activity limitations<br/>
                Balance concerns
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
