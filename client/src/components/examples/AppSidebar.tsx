import { AppSidebar } from '../AppSidebar';

export default function AppSidebarExample() {
  return (
    <div style={{ "--sidebar-width": "16rem" } as React.CSSProperties}>
      <AppSidebar />
    </div>
  );
}