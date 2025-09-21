import { useState, useEffect } from 'react';
import { ProcessingData, FlowingDot, SankeyData } from '@/types/mtf-console';
import { generateFlowingDots } from '@/lib/mtf-utils';

export function useMTFProcessing() {
  const [processingData, setProcessingData] = useState<ProcessingData>({
    import: { active: 12, total: 15, pending: 3 },
    analysis: { active: 8, total: 12, pending: 4 },
    risk: { active: 5, total: 8, pending: 3 },
    outreach: { active: 3, total: 5, pending: 2 }
  });

  const [sankeyData, setSankeyData] = useState<SankeyData>({
    gpReferrals: 42,
    specialistReferrals: 18,
    monitoring: 25,
    discharged: 15
  });

  const [flowingDots, setFlowingDots] = useState<FlowingDot[]>([]);

  // Generate flowing dots based on processing data
  useEffect(() => {
    const generateDots = () => {
      const newDots = generateFlowingDots(processingData);
      setFlowingDots(newDots);
    };

    generateDots();
    const interval = setInterval(generateDots, 3000);
    return () => clearInterval(interval);
  }, [processingData]);

  // Update processing data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingData(prev => ({
        import: { 
          active: 10 + Math.floor(Math.random() * 8), 
          total: 15, 
          pending: Math.floor(Math.random() * 5) 
        },
        analysis: { 
          active: 6 + Math.floor(Math.random() * 8), 
          total: 12, 
          pending: Math.floor(Math.random() * 6) 
        },
        risk: { 
          active: 3 + Math.floor(Math.random() * 6), 
          total: 8, 
          pending: Math.floor(Math.random() * 4) 
        },
        outreach: { 
          active: 2 + Math.floor(Math.random() * 4), 
          total: 5, 
          pending: Math.floor(Math.random() * 3) 
        }
      }));

      setSankeyData(prev => ({
        gpReferrals: 35 + Math.floor(Math.random() * 15),
        specialistReferrals: 15 + Math.floor(Math.random() * 10),
        monitoring: 20 + Math.floor(Math.random() * 10),
        discharged: 10 + Math.floor(Math.random() * 10)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return {
    processingData,
    sankeyData,
    flowingDots,
    setProcessingData,
    setSankeyData
  };
}
