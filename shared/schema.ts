import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean, decimal, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  medicalId: text("medical_id").notNull().unique(),
  dateOfBirth: date("date_of_birth"),
  phoneNumber: text("phone_number"),
  email: text("email"),
  address: text("address"),
  emergencyContact: jsonb("emergency_contact"), // {name, phone, relationship}
  medicalHistory: text("medical_history"),
  allergies: text("allergies"),
  medications: jsonb("medications"), // array of current medications
  insuranceInfo: jsonb("insurance_info"), // insurance details
  createdAt: timestamp("created_at").defaultNow(),
});

export const cases = pgTable("cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  caseNumber: text("case_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(), // 'pending', 'analyzing', 'diagnosed', 'treated', 'discharged'
  priority: text("priority").notNull(), // 'low', 'medium', 'high', 'critical'
  riskScore: integer("risk_score"), // 0-100
  aiAnalysis: jsonb("ai_analysis"),
  confidence: integer("confidence"), // 0-100
  assignedPhysician: text("assigned_physician"),
  department: text("department"),
  admissionDate: timestamp("admission_date"),
  dischargeDate: timestamp("discharge_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiAgents = pgTable("ai_agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'diagnostician', 'radiologist', 'treatment_planner', 'triage'
  status: text("status").notNull(), // 'active', 'busy', 'idle'
  confidence: integer("confidence"),
  isActive: boolean("is_active").default(true),
});

// Vitals and Symptoms
export const vitals = pgTable("vitals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").notNull().references(() => cases.id),
  recordedAt: timestamp("recorded_at").defaultNow(),
  temperature: decimal("temperature", { precision: 4, scale: 1 }), // Fahrenheit
  bloodPressureSystolic: integer("blood_pressure_systolic"),
  bloodPressureDiastolic: integer("blood_pressure_diastolic"),
  heartRate: integer("heart_rate"),
  respiratoryRate: integer("respiratory_rate"),
  oxygenSaturation: integer("oxygen_saturation"),
  weight: decimal("weight", { precision: 5, scale: 2 }), // pounds
  height: decimal("height", { precision: 5, scale: 2 }), // inches
  painScale: integer("pain_scale"), // 0-10
  symptoms: jsonb("symptoms"), // array of symptom objects
  notes: text("notes"),
  recordedBy: text("recorded_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Medical Imaging
export const imaging = pgTable("imaging", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").notNull().references(() => cases.id),
  type: text("type").notNull(), // 'x-ray', 'mri', 'ct', 'ultrasound'
  bodyPart: text("body_part").notNull(),
  filename: text("filename").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  aiAnnotations: jsonb("ai_annotations"), // AI-detected annotations
  radiologistNotes: text("radiologist_notes"),
  findings: text("findings"),
  impression: text("impression"),
  technician: text("technician"),
  equipment: text("equipment"),
  contrast: boolean("contrast").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Clinical Notes
export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").notNull().references(() => cases.id),
  type: text("type").notNull(), // 'soap', 'nursing', 'ai_summary', 'progress', 'discharge'
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  authorRole: text("author_role"), // 'physician', 'nurse', 'ai', 'resident'
  isPrivate: boolean("is_private").default(false),
  tags: jsonb("tags"), // array of tags
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medical Orders
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").notNull().references(() => cases.id),
  type: text("type").notNull(), // 'lab', 'medication', 'referral', 'procedure', 'imaging'
  category: text("category"), // specific subcategory
  description: text("description").notNull(),
  status: text("status").notNull(), // 'pending', 'in_progress', 'completed', 'cancelled'
  priority: text("priority").default('routine'), // 'stat', 'urgent', 'routine'
  orderedBy: text("ordered_by").notNull(),
  orderedAt: timestamp("ordered_at").defaultNow(),
  scheduledFor: timestamp("scheduled_for"),
  completedAt: timestamp("completed_at"),
  results: jsonb("results"), // lab results, medication effects, etc.
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Risk Assessments
export const riskAssessments = pgTable("risk_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").notNull().references(() => cases.id),
  assessmentType: text("assessment_type").notNull(), // 'fall', 'pressure_ulcer', 'mortality', 'readmission'
  score: integer("score").notNull(), // 0-100
  riskLevel: text("risk_level").notNull(), // 'low', 'moderate', 'high', 'critical'
  factors: jsonb("factors"), // contributing risk factors
  recommendations: jsonb("recommendations"), // recommended interventions
  assessedBy: text("assessed_by"),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

export const insertCaseSchema = createInsertSchema(cases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiAgentSchema = createInsertSchema(aiAgents).omit({
  id: true,
});

export const insertVitalsSchema = createInsertSchema(vitals).omit({
  id: true,
  createdAt: true,
});

// Form-friendly vitals schema with proper type coercion for numeric inputs
export const insertVitalsFormSchema = insertVitalsSchema.extend({
  recordedAt: z.coerce.date().optional(),
  temperature: z.coerce.number().nullable().optional().transform(val => val?.toString() ?? null),
  bloodPressureSystolic: z.coerce.number().nullable().optional(),
  bloodPressureDiastolic: z.coerce.number().nullable().optional(),
  heartRate: z.coerce.number().nullable().optional(),
  respiratoryRate: z.coerce.number().nullable().optional(),
  oxygenSaturation: z.coerce.number().nullable().optional(),
  weight: z.coerce.number().nullable().optional().transform(val => val?.toString() ?? null),
  height: z.coerce.number().nullable().optional().transform(val => val?.toString() ?? null),
  painScale: z.coerce.number().nullable().optional(),
  symptoms: z.array(z.object({
    name: z.string(),
    severity: z.string(),
    duration: z.string().optional()
  })).optional().default([]),
  notes: z.string().optional().default(""),
  recordedBy: z.string().optional().default("")
});

export const insertImagingSchema = createInsertSchema(imaging).omit({
  id: true,
  createdAt: true,
});

export const insertNotesSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrdersSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRiskAssessmentSchema = createInsertSchema(riskAssessments).omit({
  id: true,
  createdAt: true,
});

export const insertCaseExtendedSchema = insertCaseSchema.extend({
  caseNumber: z.string().optional(), // will be auto-generated if not provided
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Case = typeof cases.$inferSelect;
export type InsertCase = z.infer<typeof insertCaseSchema>;
export type InsertCaseExtended = z.infer<typeof insertCaseExtendedSchema>;
export type AiAgent = typeof aiAgents.$inferSelect;
export type InsertAiAgent = z.infer<typeof insertAiAgentSchema>;
export type Vitals = typeof vitals.$inferSelect;
export type InsertVitals = z.infer<typeof insertVitalsSchema>;
export type InsertVitalsForm = z.infer<typeof insertVitalsFormSchema>;
export type Imaging = typeof imaging.$inferSelect;
export type InsertImaging = z.infer<typeof insertImagingSchema>;
export type Notes = typeof notes.$inferSelect;
export type InsertNotes = z.infer<typeof insertNotesSchema>;
export type Orders = typeof orders.$inferSelect;
export type InsertOrders = z.infer<typeof insertOrdersSchema>;
export type RiskAssessment = typeof riskAssessments.$inferSelect;
export type InsertRiskAssessment = z.infer<typeof insertRiskAssessmentSchema>;

// Composite types for complex data structures
export type PatientWithCases = Patient & {
  cases: Case[];
};

export type CaseWithDetails = Case & {
  patient: Patient;
  vitals: Vitals[];
  imaging: Imaging[];
  notes: Notes[];
  orders: Orders[];
  riskAssessments: RiskAssessment[];
};

export type CaseListItem = {
  id: string;
  caseNumber: string;
  patientName: string;
  patientId: string;
  title: string;
  status: string;
  priority: string;
  riskScore: number | null;
  assignedPhysician: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};
