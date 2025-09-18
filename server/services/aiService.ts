import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
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
      const contextPrompt = patientContext 
        ? `Patient: ${patientContext.name}, Age: ${patientContext.age}, Symptoms: ${patientContext.symptoms}${patientContext.medicalHistory ? `, Medical History: ${patientContext.medicalHistory}` : ''}`
        : '';

      // Orchestrator response
      const orchestratorResponse = await openai.chat.completions.create({
        model: "gpt-5",
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

      // Diagnostician response
      const diagnosticianResponse = await openai.chat.completions.create({
        model: "gpt-5", 
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

      // Radiologist response
      const radiologistResponse = await openai.chat.completions.create({
        model: "gpt-5",
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

      // Treatment planner response
      const treatmentResponse = await openai.chat.completions.create({
        model: "gpt-5",
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
        model: "gpt-5",
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