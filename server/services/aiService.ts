import OpenAI from "openai";

// Using GPT-4o as the model for AI analysis
// Fallback to mock responses if no API key is provided
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface AgentResponse {
  agentType:
    | "orchestrator"
    | "diagnostician"
    | "radiologist"
    | "treatment_planner";
  agentName: string;
  content: string;
  confidence: number;
  reasoning?: string;
}

export class AIService {
  // Mock responses for when OpenAI API is not available
  private getMockResponses(
    userQuery: string,
    patientContext?: any
  ): AgentResponse[] {
    return [
      {
        agentType: "orchestrator",
        agentName: "Bone Guardian Orchestrator",
        content: `Analyzing your query: "${userQuery}". Coordinating with specialist agents for comprehensive analysis...`,
        confidence: 95,
        reasoning: "Mock orchestrator response for demonstration",
      },
      {
        agentType: "diagnostician",
        agentName: "Dr. Neural",
        content: `Based on the patient symptoms and available data, I'm analyzing potential minimal trauma fracture patterns. The clinical presentation suggests stress-related bone changes in the affected area. I recommend considering the patient's age, activity level, and pain characteristics for differential diagnosis.`,
        confidence: 87,
        reasoning: "Mock diagnostic analysis for demonstration",
      },
      {
        agentType: "radiologist",
        agentName: "RadiologyAI",
        content: `Imaging analysis reveals subtle density changes consistent with early-stage minimal trauma fracture development. Bone architecture shows minor disruption patterns. I recommend X-ray as initial imaging, with MRI if X-ray is negative but clinical suspicion remains high.`,
        confidence: 91,
        reasoning: "Mock radiological analysis for demonstration",
      },
      {
        agentType: "treatment_planner",
        agentName: "TreatmentBot",
        content: `Treatment recommendations: 1) Immediate load reduction and rest protocol for 4-6 weeks, 2) Anti-inflammatory management with NSAIDs, 3) Physical therapy consultation for gradual return to activity, 4) Follow-up imaging in 2-3 weeks. Consider calcium and vitamin D supplementation based on patient history.`,
        confidence: 93,
        reasoning: "Mock treatment planning for demonstration",
      },
    ];
  }

  async generateMultiAgentResponse(
    userQuery: string,
    patientContext?: {
      name: string;
      age: number;
      symptoms: string;
      medicalHistory?: string;
    }
  ): Promise<AgentResponse[]> {
    // If no OpenAI API key, return mock responses
    if (!openai) {
      console.log("OpenAI API key not found, using mock responses");
      return this.getMockResponses(userQuery, patientContext);
    }
    try {
      console.log("Starting multi-agent analysis...", {
        userQuery,
        patientContext,
      });
      const contextPrompt = patientContext
        ? `Patient: ${patientContext.name}, Age: ${
            patientContext.age
          }, Symptoms: ${patientContext.symptoms}${
            patientContext.medicalHistory
              ? `, Medical History: ${patientContext.medicalHistory}`
              : ""
          }`
        : "";

      // Orchestrator response
      console.log("Calling Orchestrator AI...");
      const orchestratorResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are Bone Guardian Orchestrator, a medical AI coordinator. Analyze the user query and patient context, then provide a coordinating response. Respond in JSON format with: { "content": "your response", "confidence": confidence_score_0_to_100, "reasoning": "brief reasoning" }`,
          },
          {
            role: "user",
            content: `User Query: ${userQuery}\n${contextPrompt}`,
          },
        ],
        response_format: { type: "json_object" },
      });

      console.log("Orchestrator response received");

      // Diagnostician response
      console.log("Calling Diagnostician AI...");
      const diagnosticianResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are Dr. Neural, a diagnostic AI specialist. Analyze the medical case and provide diagnostic insights. Focus on differential diagnosis and clinical reasoning. Respond in JSON format with: { "content": "your diagnostic analysis", "confidence": confidence_score_0_to_100, "reasoning": "diagnostic reasoning" }`,
          },
          {
            role: "user",
            content: `Diagnostic Query: ${userQuery}\n${contextPrompt}`,
          },
        ],
        response_format: { type: "json_object" },
      });

      console.log("Diagnostician response received");

      // Radiologist response
      console.log("Calling Radiologist AI...");
      const radiologistResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are RadiologyAI, a medical imaging specialist. Focus on imaging analysis, patterns, and radiological findings. Respond in JSON format with: { "content": "your imaging analysis", "confidence": confidence_score_0_to_100, "reasoning": "radiological reasoning" }`,
          },
          {
            role: "user",
            content: `Imaging Analysis: ${userQuery}\n${contextPrompt}`,
          },
        ],
        response_format: { type: "json_object" },
      });

      console.log("Radiologist response received");

      // Treatment planner response
      console.log("Calling Treatment Planner AI...");
      const treatmentResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are TreatmentBot, a treatment planning AI. Provide evidence-based treatment recommendations and care plans. Respond in JSON format with: { "content": "your treatment recommendations", "confidence": confidence_score_0_to_100, "reasoning": "treatment rationale" }`,
          },
          {
            role: "user",
            content: `Treatment Planning: ${userQuery}\n${contextPrompt}`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const responses: AgentResponse[] = [
        {
          agentType: "orchestrator",
          agentName: "Bone Guardian Orchestrator",
          ...JSON.parse(
            orchestratorResponse.choices[0].message.content || "{}"
          ),
        },
        {
          agentType: "diagnostician",
          agentName: "Dr. Neural",
          ...JSON.parse(
            diagnosticianResponse.choices[0].message.content || "{}"
          ),
        },
        {
          agentType: "radiologist",
          agentName: "RadiologyAI",
          ...JSON.parse(radiologistResponse.choices[0].message.content || "{}"),
        },
        {
          agentType: "treatment_planner",
          agentName: "TreatmentBot",
          ...JSON.parse(treatmentResponse.choices[0].message.content || "{}"),
        },
      ];

      console.log("All AI responses received, returning results:", responses);
      return responses;
    } catch (error) {
      console.error("AI Service Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
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
            content: `You are a medical AI radiologist. Analyze this medical image for minimal trauma fractures and bone abnormalities. Provide findings, confidence level, and recommendations in JSON format: { "findings": "detailed findings", "confidence": confidence_0_to_100, "recommendations": ["rec1", "rec2"] }`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this medical image for signs of minimal trauma fractures, bone density changes, and any other abnormalities.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Image Analysis Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to analyze medical image: ${errorMessage}`);
    }
  }
}

export const aiService = new AIService();
