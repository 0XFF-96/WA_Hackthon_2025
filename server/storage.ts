import { type User, type InsertUser, type Case, type InsertCase, type AiAgent, type InsertAiAgent, type Patient, type InsertPatient } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Patient methods
  getPatient(id: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  getAllPatients(): Promise<Patient[]>;
  
  // Case methods
  getCase(id: string): Promise<Case | undefined>;
  createCase(case_: InsertCase): Promise<Case>;
  getAllCases(): Promise<Case[]>;
  updateCase(id: string, updates: Partial<Case>): Promise<Case | undefined>;
  
  // AI Agent methods
  getAgent(id: string): Promise<AiAgent | undefined>;
  createAgent(agent: InsertAiAgent): Promise<AiAgent>;
  getAllAgents(): Promise<AiAgent[]>;
  updateAgent(id: string, updates: Partial<AiAgent>): Promise<AiAgent | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private patients: Map<string, Patient>;
  private cases: Map<string, Case>;
  private agents: Map<string, AiAgent>;

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.cases = new Map();
    this.agents = new Map();
    
    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock patients
    const patient1: Patient = {
      id: randomUUID(),
      name: "Sarah Johnson",
      age: 34,
      gender: "Female",
      medicalId: "MED-2024-0001",
      createdAt: new Date()
    };
    const patient2: Patient = {
      id: randomUUID(),
      name: "Michael Chen",
      age: 28,
      gender: "Male",
      medicalId: "MED-2024-0002",
      createdAt: new Date()
    };
    
    this.patients.set(patient1.id, patient1);
    this.patients.set(patient2.id, patient2);
    
    // Mock cases
    const case1: Case = {
      id: randomUUID(),
      patientId: patient1.id,
      title: "Suspected micro-fracture in wrist",
      description: "Patient reports wrist pain after fall, possible micro-fracture detected on initial imaging",
      status: "analyzing",
      priority: "high",
      aiAnalysis: null,
      confidence: 87,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.cases.set(case1.id, case1);
    
    // Mock AI agents
    const agents: AiAgent[] = [
      {
        id: randomUUID(),
        name: "HealthAI Orchestrator",
        role: "triage",
        status: "active",
        confidence: 95,
        isActive: true
      },
      {
        id: randomUUID(),
        name: "Dr. Neural",
        role: "diagnostician",
        status: "active", 
        confidence: 87,
        isActive: true
      },
      {
        id: randomUUID(),
        name: "RadiologyAI",
        role: "radiologist",
        status: "active",
        confidence: 91,
        isActive: true
      },
      {
        id: randomUUID(),
        name: "TreatmentBot",
        role: "treatment_planner",
        status: "idle",
        confidence: 93,
        isActive: true
      }
    ];
    
    agents.forEach(agent => this.agents.set(agent.id, agent));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Patient methods
  async getPatient(id: string): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = randomUUID();
    const patient: Patient = { ...insertPatient, id, createdAt: new Date() };
    this.patients.set(id, patient);
    return patient;
  }

  async getAllPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  // Case methods
  async getCase(id: string): Promise<Case | undefined> {
    return this.cases.get(id);
  }

  async createCase(insertCase: InsertCase): Promise<Case> {
    const id = randomUUID();
    const case_: Case = { 
      ...insertCase, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date(),
      aiAnalysis: insertCase.aiAnalysis || null,
      confidence: insertCase.confidence || null
    };
    this.cases.set(id, case_);
    return case_;
  }

  async getAllCases(): Promise<Case[]> {
    return Array.from(this.cases.values());
  }

  async updateCase(id: string, updates: Partial<Case>): Promise<Case | undefined> {
    const case_ = this.cases.get(id);
    if (!case_) return undefined;
    
    const updatedCase = { ...case_, ...updates, updatedAt: new Date() };
    this.cases.set(id, updatedCase);
    return updatedCase;
  }

  // AI Agent methods
  async getAgent(id: string): Promise<AiAgent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(insertAgent: InsertAiAgent): Promise<AiAgent> {
    const id = randomUUID();
    const agent: AiAgent = { 
      ...insertAgent, 
      id,
      confidence: insertAgent.confidence || null,
      isActive: insertAgent.isActive !== undefined ? insertAgent.isActive : true
    };
    this.agents.set(id, agent);
    return agent;
  }

  async getAllAgents(): Promise<AiAgent[]> {
    return Array.from(this.agents.values());
  }

  async updateAgent(id: string, updates: Partial<AiAgent>): Promise<AiAgent | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;
    
    const updatedAgent = { ...agent, ...updates };
    this.agents.set(id, updatedAgent);
    return updatedAgent;
  }
}

export const storage = new MemStorage();
