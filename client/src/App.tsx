import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import MTFDetection from "@/pages/MTFDetection";
import AgentChat from "@/pages/AgentChat";
import AIAgents from "@/pages/AIAgents";
import Analytics from "@/pages/Analytics";
import WorkflowVisualization from "@/pages/WorkflowVisualization";
import CaseManagement from "@/pages/CaseManagement";
import CaseDetail from "@/pages/CaseDetail";
import Monitoring from "@/pages/Monitoring";
import WorkflowManagement from "@/pages/WorkflowManagement";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/monitoring" component={Monitoring} />
      <Route path="/workflow" component={WorkflowManagement} />
      <Route path="/dashboard">
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </Route>
      <Route path="/mtf-detection">
        <DashboardLayout>
          <MTFDetection />
        </DashboardLayout>
      </Route>
      <Route path="/cases" component={() => (
        <DashboardLayout>
          <CaseManagement />
        </DashboardLayout>
      )} />
      <Route path="/cases/:id">
        <DashboardLayout>
          <CaseDetail />
        </DashboardLayout>
      </Route>
      <Route path="/agents">
        <DashboardLayout>
          <AIAgents />
        </DashboardLayout>
      </Route>
      <Route path="/workflow">
        <DashboardLayout>
          <WorkflowVisualization />
        </DashboardLayout>
      </Route>
      <Route path="/chat">
        <DashboardLayout>
          <AgentChat />
        </DashboardLayout>
      </Route>
      <Route path="/analytics">
        <DashboardLayout>
          <Analytics />
        </DashboardLayout>
      </Route>
      <Route path="/system">
        <DashboardLayout>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">System Health</h1>
            <p className="text-muted-foreground">Monitor system status and performance</p>
          </div>
        </DashboardLayout>
      </Route>
      <Route path="/settings">
        <DashboardLayout>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p className="text-muted-foreground">Configure system preferences</p>
          </div>
        </DashboardLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRoutes />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
