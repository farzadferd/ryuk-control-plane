import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Shield, Clock, Eye, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const USER_LOGS: Record<string, { timestamp: string; type: string; content: string }[]> = {
  "usr-001": [
    { timestamp: "14:23:45", type: "access", content: "ALLOW: SELECT admin_dashboard [admin.full_access]" },
    { timestamp: "13:10:22", type: "access", content: "ALLOW: PUT /admin/policies [admin.write]" },
    { timestamp: "12:45:00", type: "system", content: "session.init: sandbox ADMIN-001 [duration: 72h]" },
    { timestamp: "11:30:15", type: "access", content: "ALLOW: GET /admin/users [admin.read]" },
  ],
  "usr-002": [
    { timestamp: "14:18:22", type: "access", content: "ALLOW: WRITE sandbox-uploads/report.csv [storage.sandbox]" },
    { timestamp: "14:12:03", type: "denial", content: "DENY: SELECT customers [pii.protection.level_2]" },
    { timestamp: "13:55:41", type: "access", content: "ALLOW: GET api.staging.internal/payments [api.staging.read]" },
  ],
  "usr-003": [
    { timestamp: "13:15:22", type: "access", content: "ALLOW: SELECT orders_staging [staging.full_access]" },
    { timestamp: "12:58:33", type: "query", content: "boundary.query: 'What staging APIs can I use?'" },
    { timestamp: "12:45:00", type: "system", content: "session.init: sandbox DEV-5510 [duration: 48h]" },
  ],
  "usr-004": [
    { timestamp: "13:42:17", type: "denial", content: "DENY: PUT production-backups/db.sql [env.isolation]" },
    { timestamp: "13:02:44", type: "denial", content: "DENY: POST api.prod.internal/billing [production.deny_all]" },
    { timestamp: "12:45:00", type: "system", content: "session.expired: sandbox DEV-3301 [locked]" },
  ],
};

const ACTIVE_USERS = [
  {
    id: "usr-001",
    name: "Sarah Chen",
    email: "s.chen@corp.io",
    role: "admin" as const,
    sandboxStatus: "active" as const,
    accessExpiration: "14d 06:32:11",
    lastLogin: "2 hours ago",
  },
  {
    id: "usr-002",
    name: "Marcus Webb",
    email: "m.webb@security.net",
    role: "sandbox_user" as const,
    sandboxStatus: "expiring" as const,
    accessExpiration: "0d 04:15:33",
    lastLogin: "15 minutes ago",
  },
  {
    id: "usr-003",
    name: "Priya Sharma",
    email: "p.sharma@analytics.co",
    role: "sandbox_user" as const,
    sandboxStatus: "active" as const,
    accessExpiration: "5d 18:45:00",
    lastLogin: "1 day ago",
  },
  {
    id: "usr-004",
    name: "James Morton",
    email: "j.morton@legacy.sys",
    role: "sandbox_user" as const,
    sandboxStatus: "locked" as const,
    accessExpiration: "Expired",
    lastLogin: "3 days ago",
  },
];

const getStatusClass = (status: string) => {
  switch (status) {
    case "active":
      return "bg-[hsl(120_40%_45%)/20] text-[hsl(120_40%_45%)]";
    case "expiring":
      return "bg-[hsl(45_100%_51%)/20] text-[hsl(45_100%_40%)]";
    case "locked":
      return "bg-destructive/20 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = ACTIVE_USERS.find((u) => u.id === userId);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);

  const logs = USER_LOGS[userId || ""] || [];

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-mono text-muted-foreground text-sm">User not found.</p>
        <button
          onClick={() => navigate("/admin/users")}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Users & Access
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="px-12 py-8 border-b border-border">
        <button
          onClick={() => navigate("/admin/users")}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mb-6"
        >
          <ArrowLeft className="w-3 h-3" />
          Users & Access
        </button>
        <div className="flex items-baseline gap-4 mb-1">
          <h1 className="display-system text-foreground">{user.name}</h1>
          <Badge
            variant="outline"
            className={`font-mono text-[10px] ${user.role === "admin" ? "border-foreground" : ""}`}
          >
            {user.role}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm font-mono">{user.email}</p>
      </header>

      <div className="flex-1 overflow-y-auto px-12 py-8">
        <div className="max-w-2xl space-y-8">
          {/* Status Overview */}
          <section className="space-y-4">
            <h2 className="label-system text-[10px] uppercase tracking-wider text-muted-foreground">
              Status Overview
            </h2>
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between items-center py-2">
                <span className="label-system">Sandbox Status</span>
                <Badge className={`font-mono text-[10px] uppercase ${getStatusClass(user.sandboxStatus)}`}>
                  {user.sandboxStatus}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-border">
                <span className="label-system">Access Expiration</span>
                <span className="font-mono text-sm flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  {user.accessExpiration}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-border">
                <span className="label-system">Last Login</span>
                <span className="text-sm text-muted-foreground">{user.lastLogin}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-border">
                <span className="label-system">User ID</span>
                <span className="font-mono text-xs text-muted-foreground">{user.id}</span>
              </div>
            </div>
          </section>

          {/* Actions */}
          <section className="space-y-4">
            <h2 className="label-system text-[10px] uppercase tracking-wider text-muted-foreground">
              Actions
            </h2>
            <div className="flex gap-4 border-t border-border pt-4">
              <button
                onClick={() => setShowAuditLog(true)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 py-2"
              >
                <Eye className="w-3 h-3" />
                View Audit Log
              </button>
              <button
                onClick={() => setShowRoleDialog(true)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 py-2"
              >
                <Shield className="w-3 h-3" />
                Change Role
              </button>
              <button
                onClick={() => setShowDisableDialog(true)}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5 py-2 disabled:opacity-40"
                disabled={user.sandboxStatus === "locked"}
              >
                <Ban className="w-3 h-3" />
                Disable Access
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Disable Access Confirmation */}
      <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono text-sm">Disable Access</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-xs">
              This will immediately revoke all sandbox access for <span className="text-foreground">{user.name}</span>. Their active sessions will be terminated and access tokens invalidated. This action can be reversed by re-provisioning.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs"
              onClick={() => setShowDisableDialog(false)}
            >
              Confirm Disable
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Role Confirmation */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono text-sm">Change Role</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-xs">
              Change <span className="text-foreground">{user.name}</span>'s role from{" "}
              <span className="text-foreground">{user.role}</span> to{" "}
              <span className="text-foreground">{user.role === "admin" ? "sandbox_user" : "admin"}</span>?
              This will update their permissions immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction className="text-xs" onClick={() => setShowRoleDialog(false)}>
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Audit Log Dialog */}
      <Dialog open={showAuditLog} onOpenChange={setShowAuditLog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm">Audit Log — {user.name}</DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Recent activity for {user.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-px font-mono text-xs max-h-64 overflow-y-auto">
            {logs.length === 0 && (
              <p className="text-muted-foreground py-4 text-center">No log entries found.</p>
            )}
            {logs.map((log, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-4 py-2 px-3 -mx-3",
                  log.type === "denial" && "bg-destructive/10",
                  log.type !== "denial" && "hover:bg-secondary/30"
                )}
              >
                <span className="text-muted-foreground/60 flex-shrink-0 w-16">{log.timestamp}</span>
                <span className={cn(
                  "flex-shrink-0 w-14 uppercase text-[10px]",
                  log.type === "access" && "text-[hsl(120_40%_45%)]",
                  log.type === "denial" && "text-destructive",
                  log.type === "query" && "text-foreground",
                  log.type === "system" && "text-muted-foreground"
                )}>
                  {log.type === "access" ? "allow" : log.type === "denial" ? "deny" : log.type === "query" ? "query" : "sys"}
                </span>
                <span className="flex-1 text-foreground/80">{log.content}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}