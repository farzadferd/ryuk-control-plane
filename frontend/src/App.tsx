import { Toaster } from "./components/ui/toaster.tsx";
import { Toaster as Sonner } from "./components/ui/sonner.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SystemLayout } from "./components/layout/SystemLayout";
import Index from "./pages/Index";
import AccessExplorer from "./pages/AccessExplorer";
import SandboxStatus from "./pages/SandboxStatus";
import LogsAudit from "./pages/LogsAudit";
import DocsPage from "./pages/DocsPage";
import SandboxProvisioning from "./pages/admin/SandboxProvisioning";
import PolicyEditor from "./pages/admin/PolicyEditor";
import AuditCompliance from "./pages/admin/AuditCompliance";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import React from "react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth page - standalone, no navigation */}
          <Route path="/" element={<Auth />} />
          
          {/* Protected routes with system navigation */}
          <Route path="/dashboard" element={<SystemLayout><Index /></SystemLayout>} />
          <Route path="/access" element={<SystemLayout><AccessExplorer /></SystemLayout>} />
          <Route path="/status" element={<SystemLayout><SandboxStatus /></SystemLayout>} />
          <Route path="/logs" element={<SystemLayout><LogsAudit /></SystemLayout>} />
          <Route path="/docs" element={<SystemLayout><DocsPage /></SystemLayout>} />
          <Route path="/admin" element={<SystemLayout><SandboxProvisioning /></SystemLayout>} />
          <Route path="/admin/policies" element={<SystemLayout><PolicyEditor /></SystemLayout>} />
          <Route path="/admin/audit" element={<SystemLayout><AuditCompliance /></SystemLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;