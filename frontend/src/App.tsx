import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SystemLayout } from "@/components/layout/SystemLayout";
import { AdminRoute } from "@/components/layout/AdminRoute";
import Index from "./pages/Index";
import AccessExplorer from "./pages/AccessExplorer";
import SandboxStatus from "./pages/SandboxStatus";
import LogsAudit from "./pages/LogsAudit";
import DocsPage from "./pages/DocsPage";
import SandboxProvisioning from "./pages/admin/SandboxProvisioning";
import PolicyEditor from "./pages/admin/PolicyEditor";
import UsersAccess from "./pages/admin/UsersAccess";
import AuditCompliance from "./pages/admin/AuditCompliance";
import UserDetail from "./pages/admin/UserDetail";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth page - standalone */}
            <Route path="/" element={<Auth />} />
            
            {/* User routes */}
            <Route path="/dashboard" element={<SystemLayout><Index /></SystemLayout>} />
            <Route path="/access" element={<SystemLayout><AccessExplorer /></SystemLayout>} />
            <Route path="/status" element={<SystemLayout><SandboxStatus /></SystemLayout>} />
            <Route path="/logs" element={<SystemLayout><LogsAudit /></SystemLayout>} />
            <Route path="/docs" element={<SystemLayout><DocsPage /></SystemLayout>} />
            
            {/* Admin routes - protected */}
            <Route path="/admin" element={<AdminRoute><SandboxProvisioning /></AdminRoute>} />
            <Route path="/admin/policies" element={<AdminRoute><PolicyEditor /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UsersAccess /></AdminRoute>} />
            <Route path="/admin/users/:userId" element={<AdminRoute><UserDetail /></AdminRoute>} />
            <Route path="/admin/audit" element={<AdminRoute><AuditCompliance /></AdminRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;