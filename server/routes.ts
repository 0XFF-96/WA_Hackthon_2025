import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiService } from "./services/aiService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Multi-agent chat endpoint
  app.post("/api/chat/multi-agent", async (req, res) => {
    try {
      const { query, patientContext } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const responses = await aiService.generateMultiAgentResponse(query, patientContext);
      res.json({ responses });
    } catch (error) {
      console.error('Multi-agent chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  });

  // Medical image analysis endpoint
  app.post("/api/analyze-image", async (req, res) => {
    try {
      const { image } = req.body;
      
      if (!image) {
        return res.status(400).json({ error: "Image data is required" });
      }

      const analysis = await aiService.analyzeMedicalImage(image);
      res.json(analysis);
    } catch (error) {
      console.error('Image analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  });

  // Get patient cases
  app.get("/api/cases", async (req, res) => {
    try {
      const cases = await storage.getAllCases();
      res.json(cases);
    } catch (error) {
      console.error('Get cases error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  });

  // Get AI agents status
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAllAgents();
      res.json(agents);
    } catch (error) {
      console.error('Get agents error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
