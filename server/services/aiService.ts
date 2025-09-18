import OpenAI from "openai";

// Using GPT-4o as the model for AI analysis
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AgentResponse {
  agentType: 'orchestrator' | 'diagnostician' | 'radiologist' | 'treatment_planner';
  agentName: string;
  content: string;
  confidence: number;
  reasoning?: string;
}

export class AIService {
  async generateMultiAgentResponse(
    userQuery: string, 
    patientContext?: {
      name: string;
      age: number;
      symptoms: string;
      medicalHistory?: string;
    }
  ): Promise<AgentResponse[]> {
    try {
      console.log('Starting multi-agent analysis...', { userQuery, patientContext });
      const contextPrompt = patientContext 
        ? `Patient: ${patientContext.name}, Age: ${patientContext.age}, Symptoms: ${patientContext.symptoms}${patientContext.medicalHistory ? `, Medical History: ${patientContext.medicalHistory}` : ''}`
        : '';

      // Orchestrator response
      console.log('Calling Orchestrator AI...');
      const orchestratorResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are HealthAI Orchestrator, a medical AI coordinator. Analyze the user query and patient context, then provide a coordinating response. Respond in JSON format with: { "content": "your response", "confidence": confidence_score_0_to_100, "reasoning": "brief reasoning" }`
          },
          {
            role: "user",
            content: `User Query: ${userQuery}\n${contextPrompt}`
          }
        ],
        response_format: { type: "json_object" }
      });

      console.log('Orchestrator response received');

      // Diagnostician response
      console.log('Calling Diagnostician AI...');
      const diagnosticianResponse = await openai.chat.completions.create({
        model: "gpt-4o", 
        messages: [
          {
            role: "system",
            content: `You are Dr. Neural, a diagnostic AI specialist. Analyze the medical case and provide diagnostic insights. Focus on differential diagnosis and clinical reasoning. Respond in JSON format with: { "content": "your diagnostic analysis", "confidence": confidence_score_0_to_100, "reasoning": "diagnostic reasoning" }`
          },
          {
            role: "user",
            content: `Diagnostic Query: ${userQuery}\n${contextPrompt}`
          }
        ],
        response_format: { type: "json_object" }
      });

      console.log('Diagnostician response received');

      // Radiologist response
      console.log('Calling Radiologist AI...');
      const radiologistResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system", 
            content: `You are RadiologyAI, a medical imaging specialist. Focus on imaging analysis, patterns, and radiological findings. Respond in JSON format with: { "content": "your imaging analysis", "confidence": confidence_score_0_to_100, "reasoning": "radiological reasoning" }`
          },
          {
            role: "user",
            content: `Imaging Analysis: ${userQuery}\n${contextPrompt}`
          }
        ],
        response_format: { type: "json_object" }
      });

      console.log('Radiologist response received');

      // Treatment planner response
      console.log('Calling Treatment Planner AI...');
      const treatmentResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are TreatmentBot, a treatment planning AI. Provide evidence-based treatment recommendations and care plans. Respond in JSON format with: { "content": "your treatment recommendations", "confidence": confidence_score_0_to_100, "reasoning": "treatment rationale" }`
          },
          {
            role: "user", 
            content: `Treatment Planning: ${userQuery}\n${contextPrompt}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const responses: AgentResponse[] = [
        {
          agentType: 'orchestrator',
          agentName: 'HealthAI Orchestrator',
          ...JSON.parse(orchestratorResponse.choices[0].message.content || '{}')
        },
        {
          agentType: 'diagnostician',
          agentName: 'Dr. Neural',
          ...JSON.parse(diagnosticianResponse.choices[0].message.content || '{}')
        },
        {
          agentType: 'radiologist', 
          agentName: 'RadiologyAI',
          ...JSON.parse(radiologistResponse.choices[0].message.content || '{}')
        },
        {
          agentType: 'treatment_planner',
          agentName: 'TreatmentBot', 
          ...JSON.parse(treatmentResponse.choices[0].message.content || '{}')
        }
      ];

      console.log('All AI responses received, returning results:', responses);
      return responses;
    } catch (error) {
      console.error('AI Service Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to generate AI responses: ${errorMessage}`);
    }
  }

  async analyzeMedicalImage(base64Image: string): Promise<{
    findings: string;
    confidence: number;
    recommendations: string[];
  }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a medical AI radiologist. Analyze this medical image for micro-fractures and bone abnormalities. Provide findings, confidence level, and recommendations in JSON format: { "findings": "detailed findings", "confidence": confidence_0_to_100, "recommendations": ["rec1", "rec2"] }`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this medical image for signs of micro-fractures, bone density changes, and any other abnormalities."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Image Analysis Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to analyze medical image: ${errorMessage}`);
    }
  }
}

export const aiService = new AIService();