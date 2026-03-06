import { cn } from "@/lib/utils";

interface LogEntry {
  timestamp: string;
  type: "query" | "access" | "denial" | "system";
  content: string;
  risk?: boolean;
}

const LOGS: LogEntry[] = [
  { timestamp: "14:23:45", type: "query", content: "boundary.query: 'Can I access customer table?'" },
  { timestamp: "14:23:46", type: "access", content: "ALLOW: SELECT customers_anonymized_view [pii.protection]" },
  { timestamp: "14:18:22", type: "access", content: "ALLOW: WRITE sandbox-uploads/report.csv [storage.sandbox]" },
  { timestamp: "14:12:03", type: "denial", content: "DENY: SELECT customers [pii.protection.level_2]", risk: true },
  { timestamp: "14:11:58", type: "query", content: "boundary.query: 'Access raw customer data'" },
  { timestamp: "13:55:41", type: "access", content: "ALLOW: GET api.staging.internal/payments [api.staging.read]" },
  { timestamp: "13:42:17", type: "denial", content: "DENY: PUT production-backups/db.sql [env.isolation]", risk: true },
  { timestamp: "13:42:15", type: "system", content: "token.refresh: tk_•••7f2a [success, +24h]" },
  { timestamp: "13:30:00", type: "system", content: "session.heartbeat: sandbox DEV-7291 [active]" },
  { timestamp: "13:15:22", type: "access", content: "ALLOW: SELECT orders_staging [staging.full_access]" },
  { timestamp: "13:02:44", type: "denial", content: "DENY: POST api.prod.internal/billing [production.deny_all]", risk: true },
  { timestamp: "12:58:33", type: "query", content: "boundary.query: 'What staging APIs can I use?'" },
  { timestamp: "12:45:00", type: "system", content: "session.init: sandbox DEV-7291 [duration: 72h]" },
];

export default function LogsAudit() {
  return (
    <div className="h-screen flex flex-col">
      <header className="px-12 py-8 border-b border-border">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-4">
            <h1 className="display-system text-foreground">Trace Log</h1>
            <span className="label-system">Activity Timeline</span>
          </div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Read Only
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-12 py-8">
        <div className="max-w-3xl space-y-px font-mono text-sm">
          {LOGS.map((log, i) => (
            <div 
              key={i}
              className={cn(
                "flex items-start gap-6 py-2 px-4 -mx-4 transition-colors",
                log.risk && "bg-[hsl(0_40%_10%)/30]",
                !log.risk && "hover:bg-secondary/30"
              )}
            >
              <span className="text-muted-foreground/60 flex-shrink-0 w-20">
                {log.timestamp}
              </span>
              <span className={cn(
                "flex-shrink-0 w-16 uppercase text-xs",
                log.type === "access" && "status-allowed",
                log.type === "denial" && "status-denied",
                log.type === "query" && "text-foreground",
                log.type === "system" && "text-muted-foreground"
              )}>
                {log.type === "access" && "allow"}
                {log.type === "denial" && "deny"}
                {log.type === "query" && "query"}
                {log.type === "system" && "sys"}
              </span>
              <span className={cn(
                "flex-1",
                log.type === "denial" ? "text-muted-foreground" : "text-foreground/80"
              )}>
                {log.content}
              </span>
              {log.risk && (
                <span className="text-[10px] uppercase tracking-wider status-denied flex-shrink-0">
                  flagged
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-12 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground/60">
          Audit logs retained for 90 days. Sensitive values redacted.
        </p>
      </div>
    </div>
  );
}