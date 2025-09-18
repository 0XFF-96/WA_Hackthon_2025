import { 
  type User, type InsertUser, 
  type Case, type InsertCase, type CaseWithDetails, type CaseListItem,
  type AiAgent, type InsertAiAgent, 
  type Patient, type InsertPatient, type PatientWithCases,
  type Vitals, type InsertVitals,
  type Imaging, type InsertImaging,
  type Notes, type InsertNotes,
  type Orders, type InsertOrders,
  type RiskAssessment, type InsertRiskAssessment
} from "@shared/schema";
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
  getPatientWithCases(id: string): Promise<PatientWithCases | undefined>;
  searchPatients(query: string): Promise<Patient[]>;
  
  // Case methods
  getCase(id: string): Promise<Case | undefined>;
  getCaseWithDetails(id: string): Promise<CaseWithDetails | undefined>;
  createCase(case_: InsertCase): Promise<Case>;
  getAllCases(): Promise<CaseListItem[]>;
  searchCases(filters: {
    patientName?: string;
    patientId?: string;
    status?: string;
    priority?: string;
    riskScore?: { min?: number; max?: number };
  }): Promise<CaseListItem[]>;
  updateCase(id: string, updates: Partial<Case>): Promise<Case | undefined>;
  
  // Vitals methods
  getVitalsByCase(caseId: string): Promise<Vitals[]>;
  createVitals(vitals: InsertVitals): Promise<Vitals>;
  updateVitals(id: string, updates: Partial<Vitals>): Promise<Vitals | undefined>;
  
  // Imaging methods
  getImagingByCase(caseId: string): Promise<Imaging[]>;
  createImaging(imaging: InsertImaging): Promise<Imaging>;
  updateImaging(id: string, updates: Partial<Imaging>): Promise<Imaging | undefined>;
  
  // Notes methods
  getNotesByCase(caseId: string): Promise<Notes[]>;
  createNote(note: InsertNotes): Promise<Notes>;
  updateNote(id: string, updates: Partial<Notes>): Promise<Notes | undefined>;
  
  // Orders methods
  getOrdersByCase(caseId: string): Promise<Orders[]>;
  createOrder(order: InsertOrders): Promise<Orders>;
  updateOrder(id: string, updates: Partial<Orders>): Promise<Orders | undefined>;
  
  // Risk Assessment methods
  getRiskAssessmentsByCase(caseId: string): Promise<RiskAssessment[]>;
  createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment>;
  updateRiskAssessment(id: string, updates: Partial<RiskAssessment>): Promise<RiskAssessment | undefined>;
  
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
  private vitals: Map<string, Vitals>;
  private imaging: Map<string, Imaging>;
  private notes: Map<string, Notes>;
  private orders: Map<string, Orders>;
  private riskAssessments: Map<string, RiskAssessment>;

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.cases = new Map();
    this.agents = new Map();
    this.vitals = new Map();
    this.imaging = new Map();
    this.notes = new Map();
    this.orders = new Map();
    this.riskAssessments = new Map();
    
    // Initialize with mock data
    this.initializeMockData();
  }

  private generateCaseNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CASE-${timestamp}-${random}`;
  }

  private initializeMockData() {
    // Mock patients with enhanced data
    const patient1: Patient = {
      id: randomUUID(),
      name: "Sarah Johnson",
      age: 34,
      gender: "Female",
      medicalId: "MED-2024-0001",
      dateOfBirth: new Date(1990, 5, 15),
      phoneNumber: "(555) 123-4567",
      email: "sarah.johnson@email.com",
      address: "123 Main St, Anytown, ST 12345",
      emergencyContact: { name: "John Johnson", phone: "(555) 987-6543", relationship: "Spouse" },
      medicalHistory: "No significant past medical history. Regular exercise, non-smoker.",
      allergies: "Penicillin (rash)",
      medications: ["Ibuprofen 400mg PRN"],
      insuranceInfo: { provider: "Blue Cross", policyNumber: "BC123456789" },
      createdAt: new Date()
    };
    const patient2: Patient = {
      id: randomUUID(),
      name: "Michael Chen",
      age: 28,
      gender: "Male",
      medicalId: "MED-2024-0002",
      dateOfBirth: new Date(1996, 2, 22),
      phoneNumber: "(555) 456-7890",
      email: "michael.chen@email.com",
      address: "456 Oak Ave, Somewhere, ST 54321",
      emergencyContact: { name: "Lisa Chen", phone: "(555) 654-3210", relationship: "Sister" },
      medicalHistory: "Asthma since childhood, well-controlled with medication.",
      allergies: "Shellfish (anaphylaxis)",
      medications: ["Albuterol inhaler", "Montelukast 10mg daily"],
      insuranceInfo: { provider: "Aetna", policyNumber: "AET987654321" },
      createdAt: new Date()
    };
    
    this.patients.set(patient1.id, patient1);
    this.patients.set(patient2.id, patient2);
    
    // Mock cases with enhanced data
    const case1: Case = {
      id: randomUUID(),
      patientId: patient1.id,
      caseNumber: this.generateCaseNumber(),
      title: "Suspected micro-fracture in wrist",
      description: "34-year-old female presents with wrist pain after fall. Initial imaging suggests possible micro-fracture.",
      status: "analyzing",
      priority: "high",
      riskScore: 75,
      aiAnalysis: null,
      confidence: 87,
      assignedPhysician: "Dr. Amanda Rodriguez",
      department: "Orthopedics",
      admissionDate: new Date(),
      dischargeDate: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const case2: Case = {
      id: randomUUID(),
      patientId: patient2.id,
      caseNumber: this.generateCaseNumber(),
      title: "Asthma exacerbation follow-up",
      description: "Routine follow-up for asthma management and medication adjustment.",
      status: "pending",
      priority: "medium",
      riskScore: 45,
      aiAnalysis: null,
      confidence: null,
      assignedPhysician: "Dr. James Thompson",
      department: "Pulmonology",
      admissionDate: new Date(),
      dischargeDate: null,
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000)
    };
    
    this.cases.set(case1.id, case1);
    this.cases.set(case2.id, case2);
    
    // Mock vitals for case1
    const vitals1: Vitals = {
      id: randomUUID(),
      caseId: case1.id,
      recordedAt: new Date(),
      temperature: "98.6",
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      heartRate: 72,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      weight: "135.5",
      height: "64.0",
      painScale: 6,
      symptoms: [{ name: "Wrist pain", severity: "moderate", duration: "2 days" }],
      notes: "Patient reports 6/10 pain in right wrist, worse with movement",
      recordedBy: "Nurse Johnson",
      createdAt: new Date()
    };
    this.vitals.set(vitals1.id, vitals1);
    
    // Mock imaging for case1
    const imaging1: Imaging = {
      id: randomUUID(),
      caseId: case1.id,
      type: "x-ray",
      bodyPart: "Right Wrist",
      filename: "xray_wrist_20241218.jpg",
      filePath: "/imaging/xray_wrist_20241218.jpg",
      fileSize: 2048576,
      uploadedAt: new Date(),
      aiAnnotations: { findings: ["Possible micro-fracture at distal radius"], confidence: 0.82 },
      radiologistNotes: "Subtle cortical disruption noted at distal radius",
      findings: "Possible micro-fracture, recommend follow-up imaging",
      impression: "Suspicious for micro-fracture of distal radius",
      technician: "Tech M. Williams",
      equipment: "Siemens Ysio Max",
      contrast: false,
      createdAt: new Date()
    };
    this.imaging.set(imaging1.id, imaging1);
    
    // Mock notes for case1
    const note1: Notes = {
      id: randomUUID(),
      caseId: case1.id,
      type: "soap",
      title: "Initial Assessment - Wrist Injury",
      content: "S: 34F presents with right wrist pain after fall 2 days ago.\nO: Tenderness over distal radius, limited ROM\nA: Suspected micro-fracture of right distal radius\nP: X-ray ordered, pain management, follow-up in 1 week",
      author: "Dr. Amanda Rodriguez",
      authorRole: "physician",
      isPrivate: false,
      tags: ["initial-assessment", "orthopedics"],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.notes.set(note1.id, note1);
    
    // Mock orders for case1
    const order1: Orders = {
      id: randomUUID(),
      caseId: case1.id,
      type: "imaging",
      category: "x-ray",
      description: "X-ray right wrist, 2 views",
      status: "completed",
      priority: "urgent",
      orderedBy: "Dr. Amanda Rodriguez",
      orderedAt: new Date(Date.now() - 3600000), // 1 hour ago
      scheduledFor: new Date(Date.now() - 1800000), // 30 min ago
      completedAt: new Date(Date.now() - 900000), // 15 min ago
      results: { findings: "Possible micro-fracture identified" },
      notes: "Completed per protocol",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(order1.id, order1);
    
    // Mock risk assessment for case1
    const risk1: RiskAssessment = {
      id: randomUUID(),
      caseId: case1.id,
      assessmentType: "fall",
      score: 75,
      riskLevel: "high",
      factors: ["Recent fall", "Age 34", "Wrist fracture"],
      recommendations: ["Fall prevention education", "Physical therapy referral"],
      assessedBy: "Dr. Amanda Rodriguez",
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date()
    };
    this.riskAssessments.set(risk1.id, risk1);
    
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

  async getPatientWithCases(id: string): Promise<PatientWithCases | undefined> {
    const patient = this.patients.get(id);
    if (!patient) return undefined;
    
    const cases = Array.from(this.cases.values()).filter(case_ => case_.patientId === id);
    return { ...patient, cases };
  }

  async searchPatients(query: string): Promise<Patient[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.patients.values()).filter(
      patient => 
        patient.name.toLowerCase().includes(lowerQuery) ||
        patient.medicalId.toLowerCase().includes(lowerQuery) ||
        (patient.email && patient.email.toLowerCase().includes(lowerQuery))
    );
  }

  // Case methods
  async getCase(id: string): Promise<Case | undefined> {
    return this.cases.get(id);
  }

  async getCaseWithDetails(id: string): Promise<CaseWithDetails | undefined> {
    const case_ = this.cases.get(id);
    if (!case_) return undefined;
    
    const patient = this.patients.get(case_.patientId);
    if (!patient) return undefined;
    
    const vitals = Array.from(this.vitals.values()).filter(v => v.caseId === id);
    const imaging = Array.from(this.imaging.values()).filter(i => i.caseId === id);
    const notes = Array.from(this.notes.values()).filter(n => n.caseId === id);
    const orders = Array.from(this.orders.values()).filter(o => o.caseId === id);
    const riskAssessments = Array.from(this.riskAssessments.values()).filter(r => r.caseId === id);
    
    return { ...case_, patient, vitals, imaging, notes, orders, riskAssessments };
  }

  async createCase(insertCase: InsertCase): Promise<Case> {
    const id = randomUUID();
    const caseNumber = this.generateCaseNumber();
    const case_: Case = { 
      ...insertCase, 
      id,
      caseNumber,
      createdAt: new Date(), 
      updatedAt: new Date(),
      aiAnalysis: insertCase.aiAnalysis || null,
      confidence: insertCase.confidence || null
    };
    this.cases.set(id, case_);
    return case_;
  }

  async getAllCases(): Promise<CaseListItem[]> {
    return Array.from(this.cases.values()).map(case_ => {
      const patient = this.patients.get(case_.patientId);
      return {
        id: case_.id,
        caseNumber: case_.caseNumber,
        patientName: patient?.name || 'Unknown Patient',
        patientId: case_.patientId,
        title: case_.title,
        status: case_.status,
        priority: case_.priority,
        riskScore: case_.riskScore,
        assignedPhysician: case_.assignedPhysician,
        createdAt: case_.createdAt,
        updatedAt: case_.updatedAt
      };
    });
  }

  async searchCases(filters: {
    patientName?: string;
    patientId?: string;
    status?: string;
    priority?: string;
    riskScore?: { min?: number; max?: number };
  }): Promise<CaseListItem[]> {
    const allCases = await this.getAllCases();
    
    return allCases.filter(caseItem => {
      if (filters.patientName && !caseItem.patientName.toLowerCase().includes(filters.patientName.toLowerCase())) {
        return false;
      }
      if (filters.patientId && caseItem.patientId !== filters.patientId) {
        return false;
      }
      if (filters.status && caseItem.status !== filters.status) {
        return false;
      }
      if (filters.priority && caseItem.priority !== filters.priority) {
        return false;
      }
      if (filters.riskScore && caseItem.riskScore !== null) {
        if (filters.riskScore.min && caseItem.riskScore < filters.riskScore.min) {
          return false;
        }
        if (filters.riskScore.max && caseItem.riskScore > filters.riskScore.max) {
          return false;
        }
      }
      return true;
    });
  }

  async updateCase(id: string, updates: Partial<Case>): Promise<Case | undefined> {
    const case_ = this.cases.get(id);
    if (!case_) return undefined;
    
    const updatedCase = { ...case_, ...updates, updatedAt: new Date() };
    this.cases.set(id, updatedCase);
    return updatedCase;
  }

  // Vitals methods
  async getVitalsByCase(caseId: string): Promise<Vitals[]> {
    return Array.from(this.vitals.values()).filter(vitals => vitals.caseId === caseId);
  }

  async createVitals(insertVitals: InsertVitals): Promise<Vitals> {
    const id = randomUUID();
    const vitals: Vitals = { ...insertVitals, id, createdAt: new Date() };
    this.vitals.set(id, vitals);
    return vitals;
  }

  async updateVitals(id: string, updates: Partial<Vitals>): Promise<Vitals | undefined> {
    const vitals = this.vitals.get(id);
    if (!vitals) return undefined;
    
    const updatedVitals = { ...vitals, ...updates };
    this.vitals.set(id, updatedVitals);
    return updatedVitals;
  }

  // Imaging methods
  async getImagingByCase(caseId: string): Promise<Imaging[]> {
    return Array.from(this.imaging.values()).filter(imaging => imaging.caseId === caseId);
  }

  async createImaging(insertImaging: InsertImaging): Promise<Imaging> {
    const id = randomUUID();
    const imaging: Imaging = { ...insertImaging, id, createdAt: new Date() };
    this.imaging.set(id, imaging);
    return imaging;
  }

  async updateImaging(id: string, updates: Partial<Imaging>): Promise<Imaging | undefined> {
    const imaging = this.imaging.get(id);
    if (!imaging) return undefined;
    
    const updatedImaging = { ...imaging, ...updates };
    this.imaging.set(id, updatedImaging);
    return updatedImaging;
  }

  // Notes methods
  async getNotesByCase(caseId: string): Promise<Notes[]> {
    return Array.from(this.notes.values()).filter(note => note.caseId === caseId);
  }

  async createNote(insertNote: InsertNotes): Promise<Notes> {
    const id = randomUUID();
    const note: Notes = { 
      ...insertNote, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: string, updates: Partial<Notes>): Promise<Notes | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    
    const updatedNote = { ...note, ...updates, updatedAt: new Date() };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  // Orders methods
  async getOrdersByCase(caseId: string): Promise<Orders[]> {
    return Array.from(this.orders.values()).filter(order => order.caseId === caseId);
  }

  async createOrder(insertOrder: InsertOrders): Promise<Orders> {
    const id = randomUUID();
    const order: Orders = { 
      ...insertOrder, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, updates: Partial<Orders>): Promise<Orders | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...updates, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Risk Assessment methods
  async getRiskAssessmentsByCase(caseId: string): Promise<RiskAssessment[]> {
    return Array.from(this.riskAssessments.values()).filter(assessment => assessment.caseId === caseId);
  }

  async createRiskAssessment(insertAssessment: InsertRiskAssessment): Promise<RiskAssessment> {
    const id = randomUUID();
    const assessment: RiskAssessment = { ...insertAssessment, id, createdAt: new Date() };
    this.riskAssessments.set(id, assessment);
    return assessment;
  }

  async updateRiskAssessment(id: string, updates: Partial<RiskAssessment>): Promise<RiskAssessment | undefined> {
    const assessment = this.riskAssessments.get(id);
    if (!assessment) return undefined;
    
    const updatedAssessment = { ...assessment, ...updates };
    this.riskAssessments.set(id, updatedAssessment);
    return updatedAssessment;
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
