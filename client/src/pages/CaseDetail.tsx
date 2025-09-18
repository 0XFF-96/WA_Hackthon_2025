import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  Activity,
  FileText,
  Pill,
  ClipboardList,
  TrendingUp,
  Brain
} from "lucide-react";
import { Link } from "wouter";
import type { CaseWithDetails } from "@shared/schema";
import { VitalsTab } from "@/components/VitalsTab";
import { AICaseAnalysis } from "@/components/AICaseAnalysis";

export default function CaseDetail() {
  const [match, params] = useRoute("/cases/:id");
  const caseId = params?.id;

  // Fetch case details
  const { data: caseData, isLoading, error } = useQuery<CaseWithDetails>({
    queryKey: [`/api/cases/${caseId}`],
    enabled: !!caseId,
    staleTime: 30000
  });

  if (!match || !caseId) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 font-medium">Invalid case ID</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-96" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        
        {/* Patient Overview Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Skeleton */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 font-medium">Error loading case details</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error ? error.message : 'Case not found'}
          </p>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    analyzing: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    diagnosed: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    treated: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    discharged: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  };

  const priorityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    critical: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
  };

  const getRiskScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-case-detail">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/cases">
          <Button variant="ghost" size="sm" data-testid="button-back-to-cases">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-case-title">
            {caseData.title}
          </h1>
          <p className="text-muted-foreground">
            Case {caseData.caseNumber} • {formatDate(caseData.createdAt)}
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <Badge className={statusColors[caseData.status as keyof typeof statusColors]}>
            {caseData.status}
          </Badge>
          <Badge variant="outline" className={priorityColors[caseData.priority as keyof typeof priorityColors]}>
            {caseData.priority}
          </Badge>
          {caseData.riskScore && (
            <Badge variant="secondary" className={getRiskScoreColor(caseData.riskScore)}>
              Risk: {caseData.riskScore}%
            </Badge>
          )}
        </div>
      </div>

      {/* Patient Overview */}
      <Card data-testid="card-patient-overview">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Patient Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Patient Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" alt={caseData.patient.name} />
                  <AvatarFallback>
                    {caseData.patient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold" data-testid="text-patient-name">
                    {caseData.patient.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {caseData.patient.age} years old • {caseData.patient.gender}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <FileText className="w-4 h-4 mr-2" />
                  Medical ID: {caseData.patient.medicalId}
                </div>
                {caseData.patient.dateOfBirth && (
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    DOB: {new Date(caseData.patient.dateOfBirth).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="font-medium">Contact Information</h4>
              <div className="space-y-2 text-sm">
                {caseData.patient.phoneNumber && (
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2" />
                    {caseData.patient.phoneNumber}
                  </div>
                )}
                {caseData.patient.email && (
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    {caseData.patient.email}
                  </div>
                )}
                {caseData.patient.address && (
                  <div className="flex items-start text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                    <span>{caseData.patient.address}</span>
                  </div>
                )}
                {caseData.patient.emergencyContact && typeof caseData.patient.emergencyContact === 'object' && (
                  <div className="pt-2 border-t">
                    <p className="font-medium text-xs text-muted-foreground mb-1">Emergency Contact</p>
                    <p className="text-sm">
                      {typeof caseData.patient.emergencyContact === 'object' && caseData.patient.emergencyContact && 'name' in caseData.patient.emergencyContact ? 
                        `${(caseData.patient.emergencyContact as any).name} (${(caseData.patient.emergencyContact as any).relationship})` : 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {typeof caseData.patient.emergencyContact === 'object' && caseData.patient.emergencyContact && 'phone' in caseData.patient.emergencyContact ? 
                        (caseData.patient.emergencyContact as any).phone : 'N/A'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Medical History */}
            <div className="space-y-3">
              <h4 className="font-medium">Medical History</h4>
              <div className="space-y-3 text-sm">
                {caseData.patient.allergies && (
                  <div>
                    <p className="font-medium text-red-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Allergies
                    </p>
                    <p className="text-muted-foreground">{caseData.patient.allergies}</p>
                  </div>
                )}
                {caseData.patient.medications && Array.isArray(caseData.patient.medications) && caseData.patient.medications.length > 0 && (
                  <div>
                    <p className="font-medium flex items-center">
                      <Pill className="w-4 h-4 mr-1" />
                      Current Medications
                    </p>
                    <ul className="text-muted-foreground space-y-1">
                      {caseData.patient.medications.map((med, idx) => (
                        <li key={idx}>• {typeof med === 'string' ? med : String(med)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {caseData.patient.medicalHistory && (
                  <div>
                    <p className="font-medium flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      History
                    </p>
                    <p className="text-muted-foreground">{caseData.patient.medicalHistory}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Risk Assessment */}
      {caseData.riskAssessments && caseData.riskAssessments.length > 0 && (
        <Card data-testid="card-risk-assessment">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              AI Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {caseData.riskAssessments.map((assessment) => (
                <div key={assessment.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">
                      {assessment.assessmentType.replace('_', ' ')} Risk
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className={getRiskScoreColor(assessment.score)}
                    >
                      {assessment.score}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Level: <span className="font-medium capitalize">{assessment.riskLevel}</span>
                  </p>
                  {assessment.factors && Array.isArray(assessment.factors) && (
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1">Risk Factors:</p>
                      <ul className="space-y-1">
                        {assessment.factors.map((factor, idx) => (
                          <li key={idx}>• {typeof factor === 'string' ? factor : String(factor)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabbed Content */}
      <Card data-testid="card-case-tabs">
        <CardContent className="pt-6">
          <Tabs defaultValue="vitals" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="vitals" data-testid="tab-vitals">
                <Activity className="w-4 h-4 mr-2" />
                Vitals & Symptoms
              </TabsTrigger>
              <TabsTrigger value="imaging" data-testid="tab-imaging">
                <Brain className="w-4 h-4 mr-2" />
                Imaging
              </TabsTrigger>
              <TabsTrigger value="notes" data-testid="tab-notes">
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="orders" data-testid="tab-orders">
                <ClipboardList className="w-4 h-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="ai-analysis" data-testid="tab-ai-analysis">
                <Brain className="w-4 h-4 mr-2" />
                AI Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vitals" className="mt-6">
              <VitalsTab caseId={caseId} />
            </TabsContent>

            <TabsContent value="imaging" className="mt-6">
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Medical Imaging tab will be implemented</p>
                <p className="text-sm mt-1">
                  {caseData.imaging?.length || 0} imaging studies available
                </p>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Clinical Notes tab will be implemented</p>
                <p className="text-sm mt-1">
                  {caseData.notes?.length || 0} clinical notes available
                </p>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Medical Orders tab will be implemented</p>
                <p className="text-sm mt-1">
                  {caseData.orders?.length || 0} medical orders available
                </p>
              </div>
            </TabsContent>

            <TabsContent value="ai-analysis" className="mt-6">
              <AICaseAnalysis caseData={caseData} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}