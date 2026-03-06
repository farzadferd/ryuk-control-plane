import { cn } from "@/lib/utils";

const SESSIONS = [
  { user: "alice@company.com", queries: 45, denials: 2, risk: "low", duration: "2h 15m" },
  { user: "bob@company.com", queries: 128, denials: 8, risk: "medium", duration: "4h 30m" },
  { user: "carol@company.com", queries: 23, denials: 12, risk: "high", duration: "1h 45m" },
  { user: "dave@company.com", queries: 67, denials: 0, risk: "low", duration: "3h 00m" },
];

const TOKEN_LOGS = [
  { time: "14:45:23", token: "tk_•••a3f2", action: "validate", result: "success" },
  { time: "14:45:21", token: "tk_•••a3f2", action: "scope_check", result: "success" },
  { time: "14:45:18", token: "tk_•••b7e1", action: "validate", result: "expired" },
  { time: "14:44:55", token: "tk_•••a3f2", action: "refresh", result: "success" },
  { time: "14:44:32", token: "tk_•••c9d4", action: "validate", result: "invalid" },
];

// Simple heatmap data
const HEATMAP = [
  [0, 0, 1, 0, 2, 0, 0],
  [0, 1, 0, 0, 0, 0, 0],
  [3, 2, 4, 2, 3, 0, 0],
  [5, 3, 2, 4, 2, 1, 0],
  [4, 5, 3, 3, 1, 0, 0],
  [1, 2, 1, 1, 0, 0, 0],
];

export default function AuditCompliance() {
  return (
    <div className="h-screen flex flex-col">
      <header className="px-12 py-8 border-b border-border">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-4">
            <h1 className="display-system text-foreground">Audit</h1>
            <span className="label-system">Compliance & Analysis</span>
          </div>
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Export Artifact
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-12 py-8">
        <div className="max-w-5xl space-y-16">
          {/* Risk Heatmap */}
          <section className="space-y-6">
            <span className="label-system">Denial Heatmap · Last 7 Days</span>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 pl-12">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <div key={i} className="w-8 text-center text-[10px] text-muted-foreground">
                    {d}
                  </div>
                ))}
              </div>
              {HEATMAP.map((row, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="w-10 text-right text-[10px] text-muted-foreground pr-2">
                    {String(i * 4).padStart(2, '0')}:00
                  </span>
                  {row.map((val, j) => (
                    <div
                      key={j}
                      className={cn(
                        "w-8 h-6 rounded-sm",
                        val === 0 && "bg-secondary/30",
                        val === 1 && "bg-foreground/10",
                        val === 2 && "bg-foreground/20",
                        val >= 3 && val < 5 && "bg-foreground/30",
                        val >= 5 && "bg-foreground/50"
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Sessions */}
          <section className="space-y-6">
            <span className="label-system">Session Analysis</span>

            <div className="space-y-px">
              <div className="grid grid-cols-5 gap-4 py-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                <span>User</span>
                <span>Queries</span>
                <span>Denials</span>
                <span>Risk</span>
                <span>Duration</span>
              </div>

              {SESSIONS.map((session, i) => (
                <div 
                  key={i}
                  className={cn(
                    "grid grid-cols-5 gap-4 py-3 border-t border-border text-sm -mx-4 px-4",
                    session.risk === "high" && "bg-[hsl(0_40%_8%)/50]"
                  )}
                >
                  <span className="text-foreground truncate">{session.user}</span>
                  <span className="font-mono text-muted-foreground">{session.queries}</span>
                  <span className={cn(
                    "font-mono",
                    session.denials > 5 ? "status-denied" : "text-muted-foreground"
                  )}>
                    {session.denials}
                  </span>
                  <span className={cn(
                    "text-xs uppercase",
                    session.risk === "low" && "status-allowed",
                    session.risk === "medium" && "status-warning",
                    session.risk === "high" && "status-denied"
                  )}>
                    {session.risk}
                  </span>
                  <span className="font-mono text-muted-foreground">{session.duration}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Token Logs */}
          <section className="space-y-6">
            <span className="label-system">Token Operations</span>

            <div className="space-y-1 font-mono text-xs">
              {TOKEN_LOGS.map((log, i) => (
                <div key={i} className="flex items-center gap-6 py-1 text-muted-foreground">
                  <span className="w-16 text-muted-foreground/60">{log.time}</span>
                  <span className="w-24">{log.token}</span>
                  <span className="w-24 text-foreground/70">{log.action}</span>
                  <span className={cn(
                    log.result === "success" && "status-allowed",
                    log.result === "expired" && "status-warning",
                    log.result === "invalid" && "status-denied"
                  )}>
                    {log.result}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}