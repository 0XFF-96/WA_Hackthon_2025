import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Brain,
  Database,
  Workflow,
  Settings,
  Activity,
  TrendingUp,
  Users
} from 'lucide-react';
import { useLocation } from 'wouter';
import { RAGManagement } from '@/components/rag/RAGManagement';
import { DataFlowView } from '@/components/workflow/DataFlowView';
import { WorkflowVisualization } from '@/components/workflow/WorkflowVisualization';

export default function WorkflowManagement() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('workflow');

  const features = [
    {
      icon: Brain,
      title: "Multi-Agent Workflow",
      description: "Real-time AI agent collaboration and decision tracking",
      color: "bg-blue-500"
    },
    {
      icon: Database,
      title: "RAG Management",
      description: "Controllable knowledge base and search capabilities",
      color: "bg-green-500"
    },
    {
      icon: Workflow,
      title: "Data Flow Visualization",
      description: "End-to-end RAG pipeline execution tracking",
      color: "bg-purple-500"
    },
    {
      icon: Settings,
      title: "System Configuration",
      description: "Configure AI models and workflow parameters",
      color: "bg-orange-500"
    }
  ];

  const stats = [
    { label: "Active Agents", value: "4", icon: Users },
    { label: "Knowledge Base Size", value: "2.5GB", icon: Database },
    { label: "Avg Response Time", value: "1.2s", icon: TrendingUp },
    { label: "Success Rate", value: "96.5%", icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Workflow className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900">
              Workflow Management
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Monitor and control AI agent workflows, manage knowledge bases, 
              and visualize real-time data processing pipelines.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab(index === 0 ? 'workflow' : index === 1 ? 'rag' : index === 2 ? 'dataflow' : 'settings')}>
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="workflow">Multi-Agent Workflow</TabsTrigger>
            <TabsTrigger value="rag">RAG Management</TabsTrigger>
            <TabsTrigger value="dataflow">Data Flow</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="workflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Real-time Multi-Agent Workflow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WorkflowVisualization />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rag" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  RAG Knowledge Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RAGManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dataflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-primary" />
                  Data Flow Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataFlowView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">AI Agent Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Orchestrator Model</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>GPT-4o</option>
                          <option>GPT-4</option>
                          <option>Claude-3</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Diagnostician Model</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>GPT-4o</option>
                          <option>GPT-4</option>
                          <option>Claude-3</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Radiologist Model</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>GPT-4o</option>
                          <option>GPT-4</option>
                          <option>Claude-3</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Treatment Planner Model</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>GPT-4o</option>
                          <option>GPT-4</option>
                          <option>Claude-3</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">RAG Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Embedding Model</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>text-embedding-ada-002</option>
                          <option>text-embedding-3-small</option>
                          <option>text-embedding-3-large</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Chunk Size</label>
                        <input type="number" className="w-full p-2 border rounded-md" defaultValue={1000} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Pinecone Index</label>
                        <input type="text" className="w-full p-2 border rounded-md" defaultValue="medical-knowledge" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Similarity Threshold</label>
                        <input type="number" step="0.1" className="w-full p-2 border rounded-md" defaultValue={0.7} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Workflow Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Max Execution Time (seconds)</label>
                        <input type="number" className="w-full p-2 border rounded-md" defaultValue={30} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Confidence Threshold</label>
                        <input type="number" step="0.1" className="w-full p-2 border rounded-md" defaultValue={0.8} />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
