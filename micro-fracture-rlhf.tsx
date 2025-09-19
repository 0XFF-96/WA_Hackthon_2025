import React, { useState, useEffect } from 'react';
import { CheckCircle, Edit, X, Activity, User, MessageCircle, Brain, AlertTriangle, Clock, TrendingUp, BarChart3, Users, Heart } from 'lucide-react';

interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
  bmi: number;
  activityLevel: string;
}

interface ChatMessage {
  type: 'patient' | 'ai';
  message: string;
  timestamp?: string;
}

interface RiskFactor {
  label: string;
  severity: 'low' | 'medium' | 'high';
}

interface TimelineItem {
  week: string;
  title: string;
  tasks: string[];
}

interface LearningMetric {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const MicroFractureRLHF: React.FC = () => {
  const [feedbackType, setFeedbackType] = useState<string>('');
  const [showFeedbackForm, setShowFeedbackForm] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [confidenceLevel, setConfidenceLevel] = useState<number>(87);

  const patientInfo: PatientInfo = {
    id: 'MF-2024-0387',
    name: 'Sarah Chen',
    age: 34,
    gender: 'Female',
    bmi: 22.1,
    activityLevel: 'High (Marathon Runner)'
  };

  const riskFactors: RiskFactor[] = [
    { label: 'Overuse Training', severity: 'high' },
    { label: 'Previous Stress Fracture', severity: 'medium' },
    { label: 'Low Vitamin D', severity: 'medium' },
    { label: 'Amenorrhea History', severity: 'high' }
  ];

  const symptoms: string[] = [
    'Persistent shin pain during running (8 weeks)',
    'Pain increases with weight-bearing activity',
    'Mild swelling in lower leg',
    'Pain subsides with rest',
    'No visible deformity'
  ];

  const chatHistory: ChatMessage[] = [
    { type: 'patient', message: "I've been having this nagging pain in my shin for about 8 weeks now. It started after I increased my training for the upcoming marathon." },
    { type: 'ai', message: "I understand you're experiencing shin pain. Can you describe when the pain is most severe? Is it during activity, at rest, or both?" },
    { type: 'patient', message: "It's definitely worse when I run. Sometimes I have to stop completely. But it feels better when I rest." },
    { type: 'ai', message: "Based on your symptoms and training history, I'm concerned about a possible stress fracture. Have you noticed any swelling or tenderness when you press on the area?" },
    { type: 'patient', message: "Yes, there's some swelling, and it's quite tender to touch. Should I be worried?" },
    { type: 'ai', message: "Let me analyze your symptoms along with your medical history and risk factors to provide you with a comprehensive assessment." }
  ];

  const timeline: TimelineItem[] = [
    {
      week: 'Week 1-2',
      title: 'Immediate Care',
      tasks: [
        'Complete rest from running and high-impact activities',
        'Apply ice 15-20 minutes, 3-4 times daily',
        'NSAIDs for pain management (Ibuprofen 400mg TID)',
        'Orthopedic referral for imaging confirmation'
      ]
    },
    {
      week: 'Week 3-6',
      title: 'Recovery Phase',
      tasks: [
        'Continue activity modification',
        'Begin pool running/swimming for cardio maintenance',
        'Physical therapy for strength and flexibility',
        'Nutritional assessment (Calcium, Vitamin D supplementation)'
      ]
    },
    {
      week: 'Week 7-10',
      title: 'Progressive Return',
      tasks: [
        'Gradual return to weight-bearing exercise',
        'Progressive running program (10% weekly increase)',
        'Biomechanical analysis and gait assessment',
        'Monitor symptoms closely'
      ]
    },
    {
      week: 'Week 11-12',
      title: 'Full Activity',
      tasks: [
        'Return to full training if asymptomatic',
        'Continue strength training program',
        'Long-term prevention strategies',
        'Follow-up imaging if symptoms persist'
      ]
    }
  ];

  const learningMetrics: LearningMetric[] = [
    { value: '89%', label: 'Overall Accuracy', icon: <TrendingUp className="w-6 h-6" /> },
    { value: '1,247', label: 'Cases Reviewed', icon: <BarChart3 className="w-6 h-6" /> },
    { value: '94%', label: 'Triage Accuracy', icon: <Activity className="w-6 h-6" /> },
    { value: '856', label: 'Feedback Received', icon: <Users className="w-6 h-6" /> }
  ];

  const handleFeedback = (type: string) => {
    setFeedbackType(type);
    setShowFeedbackForm(true);
    
    // Auto-focus textarea after state update
    setTimeout(() => {
      const textarea = document.getElementById('feedbackText') as HTMLTextAreaElement;
      if (textarea) textarea.focus();
    }, 100);
  };

  const submitFeedback = () => {
    if (!feedbackText.trim()) {
      alert('Please provide detailed feedback before submitting.');
      return;
    }

    const feedbackData = {
      patientId: patientInfo.id,
      caseId: 'CASE-' + Date.now(),
      feedbackType,
      feedbackText,
      timestamp: new Date().toISOString(),
      reviewerId: 'DR-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };

    console.log('Feedback submitted:', feedbackData);
    alert('Thank you for your feedback! Your input has been recorded and will help improve the AI system\'s performance.');
    
    setFeedbackText('');
    setShowFeedbackForm(false);
    setFeedbackType('');
  };

  // Simulate real-time confidence updates
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = Math.random() * 2 - 1;
      const newLevel = Math.max(85, Math.min(90, confidenceLevel + variation));
      setConfidenceLevel(newLevel);
    }, 5000);

    return () => clearInterval(interval);
  }, [confidenceLevel]);

  const getRiskFactorColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadge = (level: string) => {
    const classes = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return classes[level as keyof typeof classes] || classes.medium;
  };

  const getFeedbackPlaceholder = (type: string) => {
    switch (type) {
      case 'approve':
        return "Please confirm your approval and add any additional comments about the accuracy of the diagnosis, appropriateness of triage level, or effectiveness of the treatment plan...";
      case 'modify':
        return "Please specify which aspects need modification:\n- Diagnosis accuracy or differential considerations\n- Triage priority level or urgency\n- Treatment recommendations or timeline\n- Additional tests or referrals needed...";
      case 'reject':
        return "Please explain why you disagree with the AI analysis:\n- Incorrect diagnosis or missed differentials\n- Inappropriate triage level\n- Unsafe or ineffective treatment recommendations\n- Your recommended alternative approach...";
      default:
        return "Please provide your feedback...";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-500 rounded-xl">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Micro-Fracture AI Diagnosis System
              </h1>
            </div>
            <p className="text-xl text-gray-600">Reinforcement Learning with Human Feedback Interface</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Patient Information */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-1">Patient Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500">
                <div className="text-sm font-semibold text-gray-600 mb-1">Patient ID</div>
                <div className="text-lg text-gray-800">{patientInfo.id}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500">
                <div className="text-sm font-semibold text-gray-600 mb-1">Name</div>
                <div className="text-lg text-gray-800">{patientInfo.name}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500">
                <div className="text-sm font-semibold text-gray-600 mb-1">Age</div>
                <div className="text-lg text-gray-800">{patientInfo.age} years</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500">
                <div className="text-sm font-semibold text-gray-600 mb-1">Gender</div>
                <div className="text-lg text-gray-800">{patientInfo.gender}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500">
                <div className="text-sm font-semibold text-gray-600 mb-1">BMI</div>
                <div className="text-lg text-gray-800">{patientInfo.bmi} kg/m²</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500">
                <div className="text-sm font-semibold text-gray-600 mb-1">Activity Level</div>
                <div className="text-lg text-gray-800">{patientInfo.activityLevel}</div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Risk Factors
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {riskFactors.map((factor, index) => (
                <span key={index} className={`px-3 py-2 rounded-full text-sm font-medium ${getRiskFactorColor(factor.severity)}`}>
                  {factor.label}
                </span>
              ))}
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-600" />
              Reported Symptoms
            </h3>
            <ul className="space-y-2">
              {symptoms.map((symptom, index) => (
                <li key={index} className="bg-red-50 p-3 rounded-lg border-l-3 border-red-400 text-gray-800">
                  {symptom}
                </li>
              ))}
            </ul>
          </div>

          {/* Chat History */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-green-500 pb-1">Patient Interaction History</h2>
            </div>
            
            <div className="max-h-80 overflow-y-auto space-y-4 bg-gray-50 p-4 rounded-xl">
              {chatHistory.map((message, index) => (
                <div key={index} className={`p-4 rounded-xl max-w-[85%] ${
                  message.type === 'patient' 
                    ? 'bg-blue-100 ml-auto text-right' 
                    : 'bg-green-100 mr-auto'
                }`}>
                  <div className="text-gray-800">{message.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-purple-500 pb-1">AI Generated Analysis</h2>
          </div>

          {/* Diagnosis Section */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Diagnosis
            </h3>
            <div className="space-y-3">
              <p><strong>Primary Diagnosis:</strong> Tibial Stress Fracture (Micro-fracture)</p>
              <p><strong>ICD-10 Code:</strong> M84.369A</p>
              <p><strong>Location:</strong> Mid-shaft tibia, posteromedial cortex</p>
              
              <div className="my-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${confidenceLevel}%` }}
                  ></div>
                </div>
                <p className="mt-2"><strong>Confidence Level:</strong> {confidenceLevel.toFixed(0)}% (High)</p>
              </div>
              
              <div>
                <strong>Differential Diagnoses:</strong>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Medial Tibial Stress Syndrome (10%)</li>
                  <li>Compartment Syndrome (2%)</li>
                  <li>Soft Tissue Injury (1%)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Triage Section */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Triage Assessment
            </h3>
            <div className="space-y-3">
              <p><strong>Priority Level:</strong> <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityBadge('medium')}`}>Medium</span></p>
              <p><strong>Urgency Score:</strong> 6/10</p>
              <p><strong>Recommended Action:</strong> Schedule orthopedic consultation within 48-72 hours</p>
              <p><strong>Immediate Care:</strong> Rest, ice, elevation, pain management with NSAIDs</p>
              <p><strong>Warning Signs:</strong> If pain becomes severe, numbness, or loss of function occurs, seek immediate care</p>
            </div>
          </div>

          {/* Treatment Plan */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Treatment Plan & Timeline
            </h3>
            <div className="relative pl-8">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-500"></div>
              {timeline.map((item, index) => (
                <div key={index} className="relative bg-gray-50 rounded-xl p-5 mb-4 border-l-4 border-blue-500">
                  <div className="absolute -left-10 top-6 w-4 h-4 bg-blue-500 rounded-full border-3 border-white"></div>
                  <h4 className="font-bold text-gray-800 mb-2">{item.week}: {item.title}</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {item.tasks.map((task, taskIndex) => (
                      <li key={taskIndex}>{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Edit className="w-6 h-6 text-orange-600" />
            Medical Professional Feedback
          </h2>
          <p className="text-gray-700 mb-6">
            <strong>Instructions:</strong> Please review the AI-generated diagnosis, triage, and treatment plan above. Your feedback helps improve the AI system's accuracy and clinical decision-making.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <button 
              onClick={() => handleFeedback('approve')}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              <CheckCircle className="w-5 h-5" />
              Approve Analysis
            </button>
            <button 
              onClick={() => handleFeedback('modify')}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              <Edit className="w-5 h-5" />
              Suggest Modifications
            </button>
            <button 
              onClick={() => handleFeedback('reject')}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              <X className="w-5 h-5" />
              Reject Analysis
            </button>
          </div>

          {showFeedbackForm && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Detailed Feedback</h3>
              <textarea
                id="feedbackText"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={getFeedbackPlaceholder(feedbackType)}
                className="w-full min-h-32 p-4 border-2 border-gray-300 rounded-xl resize-vertical focus:border-blue-500 focus:outline-none transition-colors"
              />
              <button
                onClick={submitFeedback}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                Submit Feedback
              </button>
            </div>
          )}

          {/* Learning Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {learningMetrics.map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-xl text-center shadow-lg">
                <div className="flex justify-center mb-3 text-blue-600">
                  {metric.icon}
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</div>
                <div className="text-gray-600 text-sm">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroFractureRLHF;