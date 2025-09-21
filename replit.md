# Bone Guardian - Minimal trauma fracture Diagnosis & Treatment Platform

## Overview

Bone Guardian is an advanced AI-powered healthcare platform designed for minimal trauma fracture diagnosis, triage, and treatment planning. The system leverages multi-agent AI simulation to provide comprehensive medical analysis and decision-making support for healthcare professionals. The platform combines medical imaging analysis, patient data management, and real-time AI consultation through multiple specialized agents working collaboratively.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The client-side application is built using React with TypeScript, featuring a modern component-based architecture. The UI utilizes shadcn/ui components styled with Tailwind CSS, following Material Design principles adapted for healthcare interfaces. The application implements a sidebar navigation pattern with dedicated sections for dashboard, patient cases, AI agents, and workflow visualization.

Key frontend decisions:

- **Routing**: Uses Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and data fetching
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing
- **Styling**: Tailwind CSS with custom healthcare-focused color palette and design tokens
- **Component Library**: Radix UI primitives wrapped in shadcn/ui components for accessibility

### Backend Architecture

The server follows a RESTful API design using Express.js with TypeScript. The architecture separates concerns through distinct layers for routing, services, and data access. The AI service layer handles multi-agent coordination and OpenAI integration for medical analysis.

Core backend patterns:

- **API Layer**: Express routes with standardized error handling and logging
- **Service Layer**: Dedicated AI service for multi-agent response generation and medical image analysis
- **Data Layer**: Storage abstraction interface for CRUD operations across different entity types
- **Database ORM**: Drizzle ORM for type-safe database queries and schema management

### Database Design

The system uses PostgreSQL with a comprehensive schema designed for healthcare data management. The database structure supports patient records, medical cases, vitals tracking, imaging data, and AI analysis results.

Key entities and relationships:

- **Patients**: Core patient demographics and medical history
- **Cases**: Medical cases linked to patients with status tracking and AI analysis
- **Vitals**: Time-series vital signs data for patient monitoring
- **Imaging**: Medical imaging data with AI analysis results
- **AI Agents**: Agent configurations and performance tracking
- **Notes and Orders**: Clinical documentation and treatment orders

### Multi-Agent AI System

The platform implements a coordinated multi-agent AI system where specialized agents collaborate on medical diagnosis and treatment planning. Each agent has a specific role and expertise area, working together to provide comprehensive medical analysis.

Agent specializations:

- **Orchestrator**: Coordinates multi-agent analysis and manages workflow
- **Diagnostician**: Primary diagnostic analysis and pattern recognition
- **Radiologist**: Medical imaging interpretation and fracture detection
- **Treatment Planner**: Treatment recommendation and care planning

### Security and Data Protection

Healthcare data handling follows HIPAA compliance patterns with secure data transmission and storage. The system implements session-based authentication and ensures patient data privacy through proper access controls.

## External Dependencies

### AI and Machine Learning

- **OpenAI GPT-5**: Primary AI engine for multi-agent medical analysis and natural language processing
- **Medical Image Analysis**: Integrated AI models for fracture detection and radiological interpretation

### Database and Storage

- **PostgreSQL**: Primary database via Neon serverless platform
- **Drizzle ORM**: Type-safe database operations and schema management
- **Connect-pg-simple**: Session store for PostgreSQL

### Frontend Libraries

- **React Ecosystem**: React 18 with TypeScript for component development
- **TanStack Query**: Server state management and data synchronization
- **Radix UI**: Accessible component primitives for UI development
- **Tailwind CSS**: Utility-first CSS framework with custom healthcare design system
- **Recharts**: Data visualization library for medical charts and analytics

### Development and Build Tools

- **Vite**: Build tool and development server
- **TypeScript**: Static typing for enhanced development experience
- **ESBuild**: Fast JavaScript bundling for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Healthcare-Specific Integrations

The platform is designed to integrate with healthcare systems and follows medical data standards for interoperability with existing hospital information systems and electronic health records.
