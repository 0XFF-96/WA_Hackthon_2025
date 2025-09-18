import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, AlertTriangle, CheckCircle } from "lucide-react";

interface DataVisualizationProps {
  className?: string;
}

export function DataVisualization({ className = "" }: DataVisualizationProps) {
  //todo: remove mock functionality
  const diagnosticTrends = [
    { month: 'Jan', cases: 45, accuracy: 92 },
    { month: 'Feb', cases: 52, accuracy: 94 },
    { month: 'Mar', cases: 48, accuracy: 91 },
    { month: 'Apr', cases: 61, accuracy: 96 },
    { month: 'May', cases: 55, accuracy: 95 },
    { month: 'Jun', cases: 67, accuracy: 97 },
  ];

  const caseDistribution = [
    { name: 'Micro-fractures', value: 45, color: 'hsl(var(--chart-1))' },
    { name: 'Stress fractures', value: 30, color: 'hsl(var(--chart-2))' },
    { name: 'Bone density', value: 15, color: 'hsl(var(--chart-3))' },
    { name: 'Other', value: 10, color: 'hsl(var(--chart-4))' },
  ];

  const systemMetrics = [
    { label: "AI Diagnostic Accuracy", value: 96, trend: "+2.1%" },
    { label: "Average Processing Time", value: 85, trend: "-12%" },
    { label: "Patient Satisfaction", value: 94, trend: "+5.3%" },
    { label: "System Uptime", value: 99, trend: "+0.1%" },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {/* System Metrics */}
      <Card data-testid="card-system-metrics">
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <TrendingUp className="w-4 h-4 mr-2" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {systemMetrics.map((metric, index) => (
            <div key={index} className="space-y-2" data-testid={`metric-${index}`}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{metric.label}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{metric.value}%</span>
                  <Badge variant="secondary" className="text-xs">
                    {metric.trend}
                  </Badge>
                </div>
              </div>
              <Progress value={metric.value} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Case Distribution */}
      <Card data-testid="card-case-distribution">
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Users className="w-4 h-4 mr-2" />
            Case Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={caseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {caseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {caseDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs" data-testid={`distribution-${index}`}>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Diagnostic Trends */}
      <Card className="md:col-span-2 lg:col-span-1" data-testid="card-diagnostic-trends">
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Diagnostic Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={diagnosticTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  fontSize={10}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  fontSize={10}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cases" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div data-testid="stat-total-cases">
              <div className="text-2xl font-bold text-primary">328</div>
              <div className="text-xs text-muted-foreground">Total Cases</div>
            </div>
            <div data-testid="stat-avg-accuracy">
              <div className="text-2xl font-bold text-green-600">94.5%</div>
              <div className="text-xs text-muted-foreground">Avg. Accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}