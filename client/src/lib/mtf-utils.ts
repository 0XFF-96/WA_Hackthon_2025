import { FlowingDot, ProcessingData, MTFCase } from '@/types/mtf-console';

// Risk level styling utilities
export function getRiskLevelColor(level: string): string {
  switch (level) {
    case 'critical': 
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high': 
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium': 
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default: 
      return 'bg-green-100 text-green-800 border-green-200';
  }
}

// Status styling utilities
export function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': 
      return 'bg-red-100 text-red-800';
    case 'reviewed': 
      return 'bg-yellow-100 text-yellow-800';
    case 'contacted': 
      return 'bg-blue-100 text-blue-800';
    case 'completed': 
      return 'bg-green-100 text-green-800';
    case 'outreach_sent': 
      return 'bg-green-100 text-green-800';
    case 'pending_review': 
      return 'bg-yellow-100 text-yellow-800';
    case 'processing': 
      return 'bg-blue-100 text-blue-800';
    default: 
      return 'bg-gray-100 text-gray-800';
  }
}

// Email status configuration
export function getEmailStatusConfig(status: string) {
  switch (status) {
    case 'sent':
      return { 
        color: 'bg-green-100 text-green-800', 
        icon: 'CheckCircle', 
        label: 'Email Sent' 
      };
    case 'pending':
      return { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: 'Clock', 
        label: 'Pending Send' 
      };
    case 'failed':
      return { 
        color: 'bg-red-100 text-red-800', 
        icon: 'X', 
        label: 'Send Failed' 
      };
    default:
      return { 
        color: 'bg-gray-100 text-gray-800', 
        icon: 'Info', 
        label: 'Not Required' 
      };
  }
}

// Status text utilities
export function getStatusText(status: string): string {
  switch (status) {
    case 'outreach_sent': return 'Outreach Sent';
    case 'pending_review': return 'Pending Review';
    case 'processing': return 'Processing';
    case 'completed': return 'Completed';
    case 'pending': return 'Pending';
    case 'reviewed': return 'Reviewed';
    case 'contacted': return 'Contacted';
    default: return status;
  }
}

// Time formatting utilities
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}

// Generate flowing dots for processing pipeline
export function generateFlowingDots(processingData: ProcessingData): FlowingDot[] {
  const stages: (keyof ProcessingData)[] = ['import', 'analysis', 'risk', 'outreach'];
  const newDots: FlowingDot[] = [];
  
  stages.forEach((stage, stageIndex) => {
    const count = processingData[stage].active;
    for (let i = 0; i < count; i++) {
      const priorities: FlowingDot['priority'][] = ['low', 'medium', 'high', 'critical'];
      newDots.push({
        id: `${stage}-${i}`,
        stage: stageIndex,
        progress: Math.random() * 100,
        speed: 0.5 + Math.random() * 1.0,
        priority: priorities[Math.floor(Math.random() * 4)]
      });
    }
  });
  
  return newDots;
}

// Medical text highlighting
export function highlightClinicalKeywords(text: string): string {
  const keywords = [
    'high-energy trauma', 'low-energy trauma', 'minimal trauma',
    'vertebral fracture', 'hip fracture', 'distal radius',
    'osteoporosis', 'bone density', 'DEXA scan',
    'fall from height', 'motor vehicle', 'bicycle accident'
  ];
  
  let highlightedText = text;
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    highlightedText = highlightedText.replace(
      regex, 
      '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
    );
  });
  
  return highlightedText;
}

// Risk factor definitions
export function getRiskFactorDefinition(factor: string): string {
  const definitions: Record<string, string> = {
    'Age >70': 'Advanced age increases bone fragility and fracture risk',
    'Female gender': 'Post-menopausal women have higher osteoporosis risk',
    'Low trauma mechanism': 'Fractures from minimal force suggest bone weakness',
    'Previous fracture history': 'Past fractures indicate ongoing bone health issues',
    'Male gender': 'While less common, male osteoporosis is underdiagnosed',
    'High-energy trauma': 'Severe force injuries less likely related to bone fragility',
    'Age <50': 'Younger patients typically have stronger bones',
    'Athletic activity': 'Regular exercise usually strengthens bones'
  };
  return definitions[factor] || 'Clinical risk factor for bone health assessment';
}

// Next step recommendations
export function getNextStepRecommendation(score: number, aiPriority: string) {
  if (score >= 80) {
    return {
      action: 'refer_specialist',
      title: 'Refer to Specialist',
      description: 'High MTF risk requires specialist evaluation',
      color: 'border-red-200 bg-red-50'
    };
  } else if (score >= 60) {
    return {
      action: 'send_gp',
      title: 'Send to GP',
      description: 'Moderate risk, GP follow-up recommended',
      color: 'border-orange-200 bg-orange-50'
    };
  } else {
    return {
      action: 'no_action',
      title: 'No Action Required',
      description: 'Low risk, routine monitoring sufficient',
      color: 'border-green-200 bg-green-50'
    };
  }
}

// Calculate risk distribution percentages
export function calculateRiskDistribution(data: { [key: string]: number }) {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key, 
      total > 0 ? (value / total) * 100 : 0
    ])
  );
}

// Filter cases utility
export function filterCases(cases: MTFCase[], searchQuery: string): MTFCase[] {
  if (!searchQuery.trim()) return cases;
  
  const query = searchQuery.toLowerCase();
  return cases.filter(case_ => 
    case_.patientName.toLowerCase().includes(query) ||
    case_.patientId.toLowerCase().includes(query) ||
    case_.reportType.toLowerCase().includes(query)
  );
}

// Sort cases by urgency and risk
export function sortCasesByPriority(cases: MTFCase[]): MTFCase[] {
  return cases.sort((a, b) => {
    // First sort by urgency (lower hours = higher priority)
    if (a.urgency !== b.urgency) {
      return a.urgency - b.urgency;
    }
    // Then by risk score (higher score = higher priority)
    return b.riskScore - a.riskScore;
  });
}
