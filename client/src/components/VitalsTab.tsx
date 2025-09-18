import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Activity, 
  Heart, 
  Thermometer, 
  Wind, 
  DropletIcon, 
  Scale, 
  Ruler, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import type { Vitals, InsertVitals } from "@shared/schema";
import { insertVitalsSchema } from "@shared/schema";

interface VitalsTabProps {
  caseId: string;
}

const vitalRanges = {
  temperature: { min: 96.8, max: 100.4, unit: "°F" },
  bloodPressureSystolic: { min: 90, max: 120, unit: "mmHg" },
  bloodPressureDiastolic: { min: 60, max: 80, unit: "mmHg" },
  heartRate: { min: 60, max: 100, unit: "bpm" },
  respiratoryRate: { min: 12, max: 20, unit: "/min" },
  oxygenSaturation: { min: 95, max: 100, unit: "%" },
  painScale: { min: 0, max: 10, unit: "/10" }
};

const symptomSeverityColors = {
  mild: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  severe: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
};

export function VitalsTab({ caseId }: VitalsTabProps) {
  const [isAddVitalsOpen, setIsAddVitalsOpen] = useState(false);
  const [symptoms, setSymptoms] = useState<Array<{ name: string; severity: string; duration: string }>>([]);
  const [newSymptom, setNewSymptom] = useState({ name: "", severity: "mild", duration: "" });
  const { toast } = useToast();

  // Form for adding new vitals
  const form = useForm<InsertVitals>({
    resolver: zodResolver(insertVitalsSchema),
    defaultValues: {
      caseId,
      recordedAt: new Date(),
      temperature: null,
      bloodPressureSystolic: null,
      bloodPressureDiastolic: null,
      heartRate: null,
      respiratoryRate: null,
      oxygenSaturation: null,
      weight: null,
      height: null,
      painScale: null,
      symptoms: [],
      notes: "",
      recordedBy: ""
    }
  });

  // Fetch vitals for this case
  const { data: vitals = [], isLoading, error } = useQuery<Vitals[]>({
    queryKey: ['/api/vitals', caseId],
    staleTime: 30000
  });

  // Add vitals mutation
  const addVitalsMutation = useMutation({
    mutationFn: async (vitalsData: InsertVitals) => 
      apiRequest(`/api/cases/${caseId}/vitals`, 'POST', vitalsData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vitals', caseId] });
      toast({
        title: "Vitals recorded successfully",
        description: "New vital signs have been added to the patient record.",
      });
      setIsAddVitalsOpen(false);
      form.reset();
      setSymptoms([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error recording vitals",
        description: error?.message || "Failed to record vitals. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddVitals = (data: InsertVitals) => {
    // Add symptoms to the data
    const vitalsWithSymptoms = { ...data, symptoms };
    addVitalsMutation.mutate(vitalsWithSymptoms);
  };

  const addSymptom = () => {
    if (!newSymptom.name.trim()) return;
    
    setSymptoms(prev => [...prev, newSymptom]);
    setNewSymptom({ name: "", severity: "mild", duration: "" });
  };

  const removeSymptom = (index: number) => {
    setSymptoms(prev => prev.filter((_, i) => i !== index));
  };

  const getVitalStatus = (value: number | null, vitalType: keyof typeof vitalRanges) => {
    if (value === null) return null;
    const range = vitalRanges[vitalType];
    if (value < range.min || value > range.max) return "abnormal";
    return "normal";
  };

  const getStatusIcon = (status: string | null) => {
    if (status === "normal") return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (status === "abnormal") return <AlertTriangle className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
        <p className="text-red-600 font-medium">Error loading vitals data</p>
        <p className="text-sm text-muted-foreground mt-1">
          {error instanceof Error ? error.message : 'Failed to load vital signs'}
        </p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/vitals', caseId] })}
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Get latest vitals for dashboard
  const latestVitals = vitals.sort((a, b) => 
    new Date(b.recordedAt || b.createdAt || 0).getTime() - new Date(a.recordedAt || a.createdAt || 0).getTime()
  )[0];

  return (
    <div className="space-y-6" data-testid="vitals-tab">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Vital Signs and Symptoms</h3>
          <p className="text-sm text-muted-foreground">Monitor and track patient vital signs</p>
        </div>
        
        <Dialog open={isAddVitalsOpen} onOpenChange={setIsAddVitalsOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-vitals">
              <Plus className="w-4 h-4 mr-2" />
              Record Vitals
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record Vital Signs</DialogTitle>
              <DialogDescription>
                Record new vital signs and symptoms for the patient.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddVitals)} className="space-y-4">
                {/* Basic Vitals Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperature (°F)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="98.6"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            data-testid="input-temperature"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="heartRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heart Rate (bpm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="72"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                            data-testid="input-heart-rate"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Clinical Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clinical Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional observations and notes..."
                          className="resize-none"
                          {...field}
                          value={field.value || ''}
                          data-testid="textarea-vitals-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="recordedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recorded By</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nurse/Technician name"
                          {...field}
                          value={field.value || ''}
                          data-testid="input-recorded-by"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddVitalsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={addVitalsMutation.isPending}
                    data-testid="button-save-vitals"
                  >
                    {addVitalsMutation.isPending ? "Recording..." : "Record Vitals"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Vitals History */}
      <Card data-testid="card-vitals-history">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Vitals History ({vitals.length} records)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vitals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No vital signs recorded yet</p>
              <p className="text-sm mt-1">Start by recording the patient's first vital signs</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vitals.map((vital) => (
                <div key={vital.id} className="p-4 border rounded-lg" data-testid={`vital-record-${vital.id}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium">
                      {formatDate(vital.recordedAt)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Recorded by: {vital.recordedBy || 'Unknown'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium">{vital.temperature || '--'}°F</p>
                      <p className="text-xs text-muted-foreground">Temperature</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{vital.heartRate || '--'} bpm</p>
                      <p className="text-xs text-muted-foreground">Heart Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">
                        {vital.bloodPressureSystolic && vital.bloodPressureDiastolic
                          ? `${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic}`
                          : '--'
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">Blood Pressure</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">
                        {vital.painScale !== null ? `${vital.painScale}/10` : '--'}
                      </p>
                      <p className="text-xs text-muted-foreground">Pain</p>
                    </div>
                  </div>
                  
                  {vital.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-medium mb-1">Notes:</p>
                      <p className="text-sm text-muted-foreground">{vital.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}