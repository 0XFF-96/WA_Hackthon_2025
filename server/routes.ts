import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiService } from "./services/aiService";
import { z } from "zod";
import { insertCaseSchema, insertVitalsSchema } from "@shared/schema";
import mtfDetectionRoutes from "./routes/mtfDetection";

export async function registerRoutes(app: Express): Promise<Server> {
  // MTF Detection routes
  app.use("/api/mtf", mtfDetectionRoutes);

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

  // AI case analysis endpoint
  app.post("/api/ai/analyze-case", async (req, res) => {
    try {
      const { query, patientContext } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const responses = await aiService.generateMultiAgentResponse(query, patientContext);
      res.json(responses);
    } catch (error) {
      console.error('AI case analysis error:', error);
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

  // Get all patients
  app.get("/api/patients", async (req, res) => {
    try {
      const patients = await storage.getAllPatients();
      res.json(patients);
    } catch (error) {
      console.error('Get patients error:', error);
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

  // Create a new case
  app.post("/api/cases", async (req, res) => {
    try {
      // Validate request body with Zod schema
      const validationResult = insertCaseSchema.omit({
        id: true,
        caseNumber: true,
        createdAt: true,
        updatedAt: true,
      }).safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed",
          details: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      const caseData = validationResult.data;

      // Verify patient exists
      const patient = await storage.getPatient(caseData.patientId);
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }

      const newCase = await storage.createCase(caseData);
      res.status(201).json(newCase);
    } catch (error) {
      console.error('Create case error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  });

  // Get case with full details
  app.get("/api/cases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const caseWithDetails = await storage.getCaseWithDetails(id);
      
      if (!caseWithDetails) {
        return res.status(404).json({ error: "Case not found" });
      }

      res.json(caseWithDetails);
    } catch (error) {
      console.error('Get case details error:', error);
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

  // Get vitals by case ID
  app.get("/api/vitals", async (req, res) => {
    try {
      const { caseId } = req.query;
      
      if (!caseId || typeof caseId !== 'string') {
        return res.status(400).json({ error: "Case ID is required" });
      }

      const vitals = await storage.getVitalsByCase(caseId);
      res.json(vitals);
    } catch (error) {
      console.error('Get vitals error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  });

  // Add vitals to case
  app.post("/api/cases/:id/vitals", async (req, res) => {
    try {
      const { id: caseId } = req.params;
      
      // Validate vitals data with caseId from params (ignore any body.caseId)
      const validationResult = insertVitalsSchema.omit({
        id: true,
        createdAt: true,
      }).safeParse({ 
        ...req.body, 
        caseId, // Use caseId from URL params
        recordedAt: req.body.recordedAt ? new Date(req.body.recordedAt) : new Date()
      });
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed",
          details: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      const vitalsData = validationResult.data;

      // Verify case exists
      const caseDetails = await storage.getCaseWithDetails(caseId);
      if (!caseDetails) {
        return res.status(404).json({ error: "Case not found" });
      }

      const newVitals = await storage.createVitals(vitalsData);
      res.status(201).json(newVitals);
    } catch (error) {
      console.error('Create vitals error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  });

  // Search cases with filters
  app.get("/api/cases/search", async (req, res) => {
    try {
      const filters = req.query;
      
      // Parse risk score filters safely
      let riskScore: { min?: number; max?: number } | undefined;
      if (filters.riskScoreMin || filters.riskScoreMax) {
        riskScore = {};
        if (filters.riskScoreMin) {
          const min = parseInt(filters.riskScoreMin as string);
          if (!isNaN(min)) riskScore.min = min;
        }
        if (filters.riskScoreMax) {
          const max = parseInt(filters.riskScoreMax as string);
          if (!isNaN(max)) riskScore.max = max;
        }
      }

      const cases = await storage.searchCases({
        patientName: filters.patientName as string,
        patientId: filters.patientId as string,
        status: filters.status as string,
        priority: filters.priority as string,
        riskScore
      });
      res.json(cases);
    } catch (error) {
      console.error('Search cases error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
