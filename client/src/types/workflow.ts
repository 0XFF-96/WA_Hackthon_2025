// Workflow Visualization Types
export interface WorkflowNode {
  id: string;
  type: 'agent' | 'process' | 'decision' | 'data';
  name: string;
  status: 'idle' | 'active' | 'completed' | 'error';
  position: { x: number; y: number };
  data?: any;
  timestamp?: Date;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type: 'data' | 'decision' | 'feedback';
  label?: string;
  status: 'pending' | 'active' | 'completed';
}

export interface WorkflowStep {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  input: any;
  output: any;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  confidence?: number;
}

export interface WorkflowExecution {
  id: string;
  caseId: string;
  status: 'running' | 'completed' | 'failed';
  steps: WorkflowStep[];
  startTime: Date;
  endTime?: Date;
  totalDuration?: number;
}

// RAG Management Types
export interface RAGDocument {
  id: string;
  filename: string;
  title: string;
  content: string;
  fileType: 'pdf' | 'txt' | 'docx' | 'md';
  fileSize: number;
  uploadDate: Date;
  status: 'uploading' | 'processing' | 'indexed' | 'error';
  chunks: DocumentChunk[];
  metadata: Record<string, any>;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  embedding?: number[];
  chunkIndex: number;
  startPosition: number;
  endPosition: number;
  metadata: {
    pageNumber?: number;
    section?: string;
    keywords?: string[];
  };
}

export interface RAGSearchResult {
  id: string;
  documentId: string;
  chunkId: string;
  content: string;
  score: number;
  metadata: Record<string, any>;
  source: {
    filename: string;
    pageNumber?: number;
    section?: string;
  };
}

export interface RAGQuery {
  id: string;
  query: string;
  embedding: number[];
  results: RAGSearchResult[];
  timestamp: Date;
  responseTime: number;
  contextUsed: string;
}

export interface RAGStats {
  totalDocuments: number;
  totalChunks: number;
  totalQueries: number;
  averageResponseTime: number;
  knowledgeBaseSize: number;
  lastUpdated: Date;
}

// Data Flow Types
export interface DataFlowStep {
  id: string;
  name: string;
  type: 'upload' | 'chunk' | 'embed' | 'store' | 'search' | 'generate';
  status: 'pending' | 'processing' | 'completed' | 'error';
  input?: any;
  output?: any;
  duration?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface DataFlowExecution {
  id: string;
  documentId?: string;
  queryId?: string;
  steps: DataFlowStep[];
  startTime: Date;
  endTime?: Date;
  totalDuration?: number;
  status: 'running' | 'completed' | 'failed';
}

// Agent Types
export interface Agent {
  id: string;
  name: string;
  type: 'diagnostician' | 'radiologist' | 'treatment_planner' | 'orchestrator';
  status: 'idle' | 'busy' | 'error';
  currentTask?: string;
  lastActivity: Date;
  performance: {
    totalTasks: number;
    successRate: number;
    averageResponseTime: number;
    confidence: number;
  };
}

export interface AgentInteraction {
  id: string;
  fromAgent: string;
  toAgent: string;
  message: string;
  data: any;
  timestamp: Date;
  type: 'request' | 'response' | 'notification';
}
