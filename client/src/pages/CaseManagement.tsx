import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Plus, 
  Search, 
  Filter, 
  Upload, 
  FileText,
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  Eye,
  MoreHorizontal,
  X
} from "lucide-react";
import type { CaseListItem, InsertCaseExtended, Patient } from "@shared/schema";
import { insertCaseExtendedSchema } from "@shared/schema";

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

export default function CaseManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form for creating new cases
  const form = useForm<InsertCaseExtended>({
    resolver: zodResolver(insertCaseExtendedSchema.omit({ caseNumber: true })),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      patientId: ""
    }
  });

  // Fetch all cases
  const { data: cases = [], isLoading, error } = useQuery<CaseListItem[]>({
    queryKey: ['/api/cases'],
    staleTime: 30000
  });

  // Fetch patients for the dropdown
  const { data: patients = [], isLoading: isLoadingPatients } = useQuery<Patient[]>({
    queryKey: ['/api/patients'],
    staleTime: 60000
  });

  // Create case mutation
  const createCaseMutation = useMutation({
    mutationFn: async (caseData: InsertCaseExtended) => 
      apiRequest('/api/cases', 'POST', caseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cases'] });
      toast({
        title: "Case created successfully",
        description: "The new patient case has been added to the system.",
      });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error creating case",
        description: error?.message || "Failed to create the case. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filtered cases based on search and filters
  const filteredCases = useMemo(() => {
    return cases.filter(case_ => {
      const matchesSearch = !searchQuery || 
        case_.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        case_.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        case_.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || case_.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || case_.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [cases, searchQuery, statusFilter, priorityFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCases = cases.length;
    const pendingCases = cases.filter(c => c.status === 'pending').length;
    const analyzingCases = cases.filter(c => c.status === 'analyzing').length;
    const highRiskCases = cases.filter(c => c.riskScore && c.riskScore >= 70).length;
    const avgRiskScore = cases.reduce((sum, c) => sum + (c.riskScore || 0), 0) / totalCases || 0;
    
    return { totalCases, pendingCases, analyzingCases, highRiskCases, avgRiskScore };
  }, [cases]);

  const handleCreateCase = (data: InsertCaseExtended) => {
    createCaseMutation.mutate(data);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-case-management">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Patient Cases</h1>
            <p className="text-muted-foreground">Manage and monitor patient cases</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Import Data Button */}
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" data-testid="button-import-data">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Patient Data</DialogTitle>
                  <DialogDescription>
                    Import patient cases from EHR, CSV files, or wearable device data.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Tabs defaultValue="ehr" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="ehr">EHR System</TabsTrigger>
                      <TabsTrigger value="csv">CSV File</TabsTrigger>
                      <TabsTrigger value="wearable">Wearable Data</TabsTrigger>
                    </TabsList>
                    <TabsContent value="ehr" className="space-y-4">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">EHR Integration</p>
                        <p className="text-xs text-muted-foreground">Connect to Electronic Health Record systems</p>
                        <Button disabled className="mt-4" variant="outline">
                          Coming Soon
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="csv" className="space-y-4">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">CSV File Upload</p>
                        <p className="text-xs text-muted-foreground">Upload patient data in CSV format</p>
                        <Button disabled className="mt-4" variant="outline">
                          Choose File
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="wearable" className="space-y-4">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">Wearable Device Data</p>
                        <p className="text-xs text-muted-foreground">Import vitals and activity data from wearables</p>
                        <Button disabled className="mt-4" variant="outline">
                          Connect Device
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Create Case Button */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-create-case">
                  <Plus className="w-4 h-4 mr-2" />
                  New Case
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Case</DialogTitle>
                  <DialogDescription>
                    Create a new patient case for diagnosis and treatment tracking.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateCase)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="patientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-patient">
                                <SelectValue placeholder="Select a patient" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingPatients ? (
                                <SelectItem value="loading" disabled>
                                  Loading patients...
                                </SelectItem>
                              ) : patients.length === 0 ? (
                                <SelectItem value="empty" disabled>
                                  No patients available
                                </SelectItem>
                              ) : (
                                patients.map((patient) => (
                                  <SelectItem key={patient.id} value={patient.id}>
                                    {patient.name} ({patient.medicalId})
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Case Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief case title" {...field} data-testid="input-case-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Detailed case description"
                              className="resize-none"
                              {...field}
                              data-testid="input-case-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-priority">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-status">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="analyzing">Analyzing</SelectItem>
                                <SelectItem value="diagnosed">Diagnosed</SelectItem>
                                <SelectItem value="treated">Treated</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <DialogFooter className="gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createCaseMutation.isPending}
                        data-testid="button-save-case"
                      >
                        {createCaseMutation.isPending ? "Creating..." : "Create Case"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Cases</p>
                  <p className="text-2xl font-bold" data-testid="stat-total-cases">
                    {stats.totalCases}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600" data-testid="stat-pending-cases">
                    {stats.pendingCases}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Analyzing</p>
                  <p className="text-2xl font-bold text-blue-600" data-testid="stat-analyzing-cases">
                    {stats.analyzingCases}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                  <p className="text-2xl font-bold text-red-600" data-testid="stat-high-risk-cases">
                    {stats.highRiskCases}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, case number, or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-cases"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger data-testid="select-filter-status">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="analyzing">Analyzing</SelectItem>
                <SelectItem value="diagnosed">Diagnosed</SelectItem>
                <SelectItem value="treated">Treated</SelectItem>
                <SelectItem value="discharged">Discharged</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger data-testid="select-filter-priority">
                <SelectValue placeholder="Filter by Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Cases ({filteredCases.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-5 w-64" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 font-medium">Error loading cases</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error instanceof Error ? error.message : 'Failed to load patient cases'}
              </p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/cases'] })}
              >
                Try Again
              </Button>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground font-medium">No cases found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first patient case to get started'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCases.map((case_) => (
                <Card key={case_.id} className="hover-elevate" data-testid={`case-row-${case_.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold" data-testid={`case-title-${case_.id}`}>
                            {case_.title}
                          </h3>
                          <Badge className={statusColors[case_.status as keyof typeof statusColors]}>
                            {case_.status}
                          </Badge>
                          <Badge variant="outline" className={priorityColors[case_.priority as keyof typeof priorityColors]}>
                            {case_.priority}
                          </Badge>
                          {case_.riskScore && (
                            <Badge variant="secondary" className={getRiskScoreColor(case_.riskScore)}>
                              Risk: {case_.riskScore}%
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Patient:</span> {case_.patientName}
                          </div>
                          <div>
                            <span className="font-medium">Case:</span> {case_.caseNumber}
                          </div>
                          <div>
                            <span className="font-medium">Physician:</span> {case_.assignedPhysician || 'Unassigned'}
                          </div>
                          <div>
                            <span className="font-medium">Created:</span> {formatDate(case_.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Link href={`/cases/${case_.id}`}>
                          <Button variant="ghost" size="sm" data-testid={`button-view-case-${case_.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}