import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Users, 
  Brain, 
  FileText, 
  BarChart3, 
  Settings,
  Activity,
  Stethoscope,
  MessageCircle,
  GitBranch,
  Shield
} from "lucide-react";
import { Link, useLocation } from "wouter";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "MTF Detection",
    url: "/mtf-detection",
    icon: Shield,
  },
  {
    title: "Patient Cases", 
    url: "/cases",
    icon: Users,
  },
  {
    title: "AI Agents",
    url: "/agents",
    icon: Brain,
  },
  {
    title: "Agent Chat",
    url: "/chat",
    icon: MessageCircle,
  },
  {
    title: "Workflow Graph",
    url: "/workflow",
    icon: GitBranch,
  },
  {
    title: "Analytics",
    url: "/analytics", 
    icon: BarChart3,
  },
];

const systemItems = [
  {
    title: "System Health",
    url: "/system",
    icon: Activity,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarHeader>
        <div className="flex items-center space-x-3 px-2 py-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-sm" data-testid="text-app-title">HealthAI</h1>
            <p className="text-xs text-muted-foreground">Minimal trauma fractures Diagnosis</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      {item.title === 'System Health' && (
                        <Badge variant="secondary" className="ml-auto">
                          99%
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center space-x-3 px-2 py-3 border-t">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="Dr. Smith" />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              DS
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-xs" data-testid="text-user-name">Dr. Smith</p>
            <p className="text-xs text-muted-foreground">Healthcare Admin</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            Online
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}