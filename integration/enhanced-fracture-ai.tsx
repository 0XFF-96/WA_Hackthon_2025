import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, Edit, X, Activity, User, MessageCircle, Brain, AlertTriangle, 
  Clock, TrendingUp, BarChart3, Users, Heart, Camera, Mic, MicOff, 
  Upload, Zap, Shield, Globe, Smartphone, Eye, Download, Share, 
  ChevronRight, Play, Pause, Volume2, VolumeX, Map, Calendar,
  Star, Award, Target, Lightbulb, Stethoscope, FileText, Bell
} from 'lucide-react';

// Enhanced interfaces
interface AIInsight {
  type: 'risk' | 'recommendation' | 'prediction';
  title: string;
  content: string;
  confidence: number;
  category: string;
}

interface PredictiveModel {
  name: string;
  accuracy: number;
  predictions: {
    healingTime: string;
    riskLevel: string;
    successRate: number;
  };
}

interface RealTimeMetric {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

const EnhancedMicroFractureAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('diagnosis');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceInput, setVoiceInput] = useState<string>('');
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);
  const [realTimeData, setRealTimeData] = useState<RealTimeMetric[]>([
    { label: 'Diagnostic Accuracy', value: 94.2, trend: 'up', change: '+2.1%' },
    { label: 'Response Time', value: 1.8, trend: 'down', change: '-0.3s' },
    { label: 'Patient Satisfaction', value: 96.8, trend: 'up', change: '+1.2%' },
    { label: 'AI Confidence', value: 89.1, trend: 'stable', change: '0.0%' }
  ]);

  // AI-powered insights
  const aiInsights: AIInsight[] = [
    {
      type: 'prediction',
      title: 'Healing Timeline Prediction',
      content: 'Based on patient data and 10,000+ similar cases, estimated recovery: 8-10 weeks with 94% confidence',
      confidence: 94,
      category: 'Recovery'
    },
    {
      type: 'risk',
      title: 'Complication Risk Assessment',
      content: 'Low risk (12%) for delayed healing due to training history. Monitor vitamin D levels closely.',
      confidence: 88,
      category: 'Risk'
    },
    {
      type: 'recommendation',
      title: 'Personalized Treatment Optimization',
      content: 'Alternative treatment path identified: Pneumatic walker + targeted PT could reduce recovery by 15%',
      confidence: 91,
      category: 'Treatment'
    }
  ];

  // Predictive modeling results
  const predictiveModels: PredictiveModel[] = [
    {
      name: 'Deep Learning Fracture Model',
      accuracy: 96.2,
      predictions: {
        healingTime: '8.3 weeks ± 1.2',
        riskLevel: 'Low-Medium',
        successRate: 94.1
      }
    },
    {
      name: 'Ensemble Clinical Model',
      accuracy: 94.8,
      predictions: {
        healingTime: '8.7 weeks ± 0.9',
        riskLevel: 'Low',
        successRate: 96.3
      }
    }
  ];

  // Voice recording simulation
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setVoiceInput("Patient reports: Sharp pain in left shin, worse with running. Pain started 3 weeks ago after increasing training intensity.");
        setIsRecording(false);
      }, 3000);
    }
  };

  // Image analysis simulation
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTimeout(() => {
        setImageAnalysis({
          findings: ['Cortical thinning detected', 'Periosteal reaction visible', 'No complete fracture line'],
          confidence: 89.3,
          recommendations: ['MRI recommended', 'Bone scan consideration', 'Load modification advised']
        });
      }, 2000);
    }
  };

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 0.5,
        change: `${(Math.random() - 0.5) * 2 > 0 ? '+' : ''}${((Math.random() - 0.5) * 2).toFixed(1)}%`
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const TabButton: React.FC<{id: string, label: string, icon: React.ReactNode}> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
        activeTab === id
          ? 'bg-blue-500 text-white shadow-lg'
          : 'bg-white/50 text-gray-700 hover:bg-white/80'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Enhanced Header with Real-time Status */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FractureAI Pro
                </h1>
                <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-green-700">LIVE</span>
                </div>
              </div>
              <p className="text-lg text-gray-600">AI-Powered Micro-Fracture Diagnosis & Treatment Platform</p>
            </div>
            
            {/* Real-time Metrics Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {realTimeData.map((metric, index) => (
                <div key={index} className="bg-white/60 backdrop-blur rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">{metric.value.toFixed(1)}{metric.label.includes('Time') ? 's' : '%'}</div>
                  <div className="text-xs text-gray-600">{metric.label}</div>
                  <div className={`text-xs font-semibold ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-2 bg-white/50 backdrop-blur rounded-2xl">
          <TabButton id="diagnosis" label="AI Diagnosis" icon={<Brain className="w-4 h-4" />} />
          <TabButton id="voice" label="Voice Analysis" icon={<Mic className="w-4 h-4" />} />
          <TabButton id="imaging" label="Image AI" icon={<Camera className="w-4 h-4" />} />
          <TabButton id="insights" label="AI Insights" icon={<Lightbulb className="w-4 h-4" />} />
          <TabButton id="predictive" label="Predictive Models" icon={<TrendingUp className="w-4 h-4" />} />
          <TabButton id="dashboard" label="Analytics" icon={<BarChart3 className="w-4 h-4" />} />
        </div>

        {/* Voice Analysis Tab */}
        {activeTab === 'voice' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Mic className="w-6 h-6 text-white" />
              </div>
              AI-Powered Voice Analysis
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-center">
                  <button
                    onClick={toggleRecording}
                    className={`p-6 rounded-full transition-all duration-300 ${
                      isRecording 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>
                  <p className="mt-4 text-gray-600">
                    {isRecording ? 'Recording... Speak naturally about symptoms' : 'Click to start voice symptom capture'}
                  </p>
                </div>
                
                {voiceInput && (
                  <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-800 mb-2">Voice Transcription:</h4>
                    <p className="text-gray-700">{voiceInput}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800">AI Voice Analysis Features:</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Real-time speech-to-text in 12 languages</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Emotion detection (pain level assessment)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Medical terminology extraction</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Severity scoring from vocal patterns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Image Analysis Tab */}
        {activeTab === 'imaging' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Camera className="w-6 h-6 text-white" />
              </div>
              AI Medical Image Analysis
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload X-ray, MRI, or CT scan</p>
                    <p className="text-sm text-gray-500">Supports DICOM, JPEG, PNG formats</p>
                  </label>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-2">Supported Analysis:</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Fracture detection & classification</li>
                    <li>• Bone density assessment</li>
                    <li>• Healing progress tracking</li>
                    <li>• Comparative analysis</li>
                  </ul>
                </div>
              </div>
              
              {imageAnalysis && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3">AI Analysis Results:</h4>
                    <div className="space-y-2">
                      {imageAnalysis.findings.map((finding: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700">{finding}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-green-300">
                      <p className="text-sm font-semibold text-green-800">
                        Confidence: {imageAnalysis.confidence}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">Recommendations:</h4>
                    <ul className="space-y-1 text-sm text-yellow-700">
                      {imageAnalysis.recommendations.map((rec: string, index: number) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'insights' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              AI-Generated Clinical Insights
            </h2>
            
            <div className="grid gap-6">
              {aiInsights.map((insight, index) => (
                <div key={index} className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl border-l-4 border-blue-500 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          insight.type === 'prediction' ? 'bg-blue-100 text-blue-800' :
                          insight.type === 'risk' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {insight.category}
                        </span>
                        <Target className="w-4 h-4 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">{insight.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{insight.confidence}%</div>
                      <div className="text-xs text-gray-500">Confidence</div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{insight.content}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${insight.confidence}%` }}
                      ></div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Predictive Models Tab */}
        {activeTab === 'predictive' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              Predictive AI Models
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {predictiveModels.map((model, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{model.name}</h3>
                    <div className="bg-purple-100 px-3 py-1 rounded-full">
                      <span className="text-purple-800 font-semibold">{model.accuracy}% Accuracy</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{model.predictions.healingTime}</div>
                        <div className="text-sm text-gray-600">Healing Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{model.predictions.riskLevel}</div>
                        <div className="text-sm text-gray-600">Risk Level</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{model.predictions.successRate}%</div>
                        <div className="text-sm text-gray-600">Success Rate</div>
                      </div>
                    </div>
                    
                    <div className="bg-white/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Model Features:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Training on 50,000+ cases</li>
                        <li>• Multi-modal input processing</li>
                        <li>• Continuous learning enabled</li>
                        <li>• Explainable AI decisions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                Real-time Performance Analytics
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">98.2%</div>
                      <div className="text-green-100">Diagnostic Accuracy</div>
                    </div>
                    <Award className="w-8 h-8 text-green-200" />
                  </div>
                  <div className="mt-4 text-sm text-green-100">↗ +2.1% from last week</div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">1.2s</div>
                      <div className="text-blue-100">Avg Response Time</div>
                    </div>
                    <Zap className="w-8 h-8 text-blue-200" />
                  </div>
                  <div className="mt-4 text-sm text-blue-100">↘ -0.3s improvement</div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">24/7</div>
                      <div className="text-purple-100">System Uptime</div>
                    </div>
                    <Shield className="w-8 h-8 text-purple-200" />
                  </div>
                  <div className="mt-4 text-sm text-purple-100">99.9% reliability</div>
                </div>
              </div>
            </div>

            {/* Global Impact Stats */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Global Impact & Reach
              </h3>
              
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-cyan-600">47</div>
                  <div className="text-sm text-gray-600">Countries Served</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">12.4K</div>
                  <div className="text-sm text-gray-600">Lives Impacted</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">89%</div>
                  <div className="text-sm text-gray-600">Early Detection Rate</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">2.1M</div>
                  <div className="text-sm text-gray-600">Data Points Analyzed</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Original Diagnosis Content for main tab */}
        {activeTab === 'diagnosis' && (
          <div className="space-y-6">
            {/* Enhanced Patient Card with more details */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-600" />
                  Patient Information
                </h2>
                
                {/* Add comprehensive patient data here - keeping original structure */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500">
                    <div className="text-sm font-semibold text-gray-600 mb-1">Patient ID</div>
                    <div className="text-lg text-gray-800">MF-2024-0387</div>
                  </div>
                  {/* ... other patient info ... */}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Stethoscope className="w-6 h-6 text-green-600" />
                  Clinical Summary
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-800 mb-2">Chief Complaint:</h4>
                    <p className="text-blue-700">8-week history of persistent shin pain, worsening with activity</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-green-800 mb-2">AI Priority Score:</h4>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-green-600">7.2/10</div>
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm">Medium-High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced diagnosis with AI confidence indicators */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Brain className="w-6 h-6 text-purple-600" />
                AI-Enhanced Diagnosis
              </h2>
              
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Primary Diagnosis</h3>
                    <p className="text-lg font-semibold text-gray-800 mb-2">Tibial Stress Fracture (Micro-fracture)</p>
                    <p className="text-gray-600 mb-4">ICD-10: M84.369A | Location: Mid-shaft tibia, posteromedial cortex</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">AI Confidence:</span>
                        <span className="text-2xl font-bold text-green-600">89.3%</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-500" style={{ width: '89.3%' }}></div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Differential Diagnoses:</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex justify-between">
                            <span>Medial Tibial Stress Syndrome</span>
                            <span className="text-gray-500">8.2%</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Compartment Syndrome</span>
                            <span className="text-gray-500">1.8%</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Soft Tissue Injury</span>
                            <span className="text-gray-500">0.7%</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                    <h4 className="font-bold text-yellow-800 mb-2">Triage Priority</h4>
                    <div className="text-center">
                      <span className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full font-bold">MEDIUM</span>
                      <div className="text-sm text-yellow-700 mt-2">48-72 hour follow-up</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <h4 className="font-bold text-blue-800 mb-2">Next Steps</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>✓ Orthopedic referral</li>
                      <li>✓ Imaging confirmation</li>
                      <li>✓ Activity modification</li>
                      <li>✓ Pain management</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                    <h4 className="font-bold text-purple-800 mb-2">AI Recommendations</h4>
                    <div className="text-sm text-purple-700">
                      <p>Consider bone density scan due to amenorrhea history and multiple risk factors.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Footer with Export Options */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <Share className="w-4 h-4" />
                Share Case
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                <FileText className="w-4 h-4" />
                Generate Summary
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Bell className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          
          {/* API Status Indicator */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">AI Models Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-600">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-600">Multi-language Support</span>
                </div>
              </div>
              
              <div className="text-gray-500">
                Powered by FractureAI v2.1.3
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMicroFractureAI;