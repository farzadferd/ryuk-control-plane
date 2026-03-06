import { useState } from "react";
import { cn } from "@/lib/utils";

type ResourceType = "table" | "api" | "storage" | "service";
type Permission = "read" | "write" | "none";

interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  permission: Permission;
  environment: string;
  reason: string;
}

const RESOURCES: Resource[] = [
  { id: "1", name: "customers_anonymized_view", type: "table", permission: "read", environment: "sandbox", reason: "PII fields redacted. Read-only access via anonymization policy." },
  { id: "2", name: "orders_staging", type: "table", permission: "write", environment: "staging", reason: "Full access to staging tables for testing workflows." },
  { id: "3", name: "customers", type: "table", permission: "none", environment: "production", reason: "Raw PII data. Direct access prohibited in sandbox context." },
  { id: "4", name: "api.staging.internal/payments", type: "api", permission: "read", environment: "staging", reason: "Read-only. Write operations require elevated scope." },
  { id: "5", name: "api.prod.internal/billing", type: "api", permission: "none", environment: "production", reason: "Production billing isolated from development contexts." },
  { id: "6", name: "sandbox-uploads", type: "storage", permission: "write", environment: "sandbox", reason: "Sandbox storage bucket. Files auto-expire after 7 days." },
  { id: "7", name: "production-backups", type: "storage", permission: "none", environment: "production", reason: "Production backup storage. Environment boundary enforced." },
  { id: "8", name: "auth-service", type: "service", permission: "read", environment: "staging", reason: "Token validation only. User creation requires admin scope." },
];

export default function AccessExplorer() {
  const [filter, setFilter] = useState<"all" | Permission>("all");
  const [selected, setSelected] = useState<Resource | null>(null);

  const filtered = RESOURCES.filter(r => 
    filter === "all" || r.permission === filter
  );

  const groupByPermission = (resources: Resource[]) => {
    const allowed = resources.filter(r => r.permission !== "none");
    const denied = resources.filter(r => r.permission === "none");
    return { allowed, denied };
  };

  const { allowed, denied } = groupByPermission(filtered);

  return (
    <div className="h-screen flex">
      {/* Main List - Dominant */}
      <div className="flex-1 flex flex-col">
        <header className="px-12 py-8 border-b border-border">
          <div className="flex items-baseline gap-4">
            <h1 className="display-system text-foreground">Access Scope</h1>
            <span className="label-system">Available Resources</span>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="px-12 py-4 border-b border-border flex items-center gap-6">
          {(["all", "read", "write", "none"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "text-sm transition-colors",
                filter === f 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f === "all" && "All"}
              {f === "read" && "Read"}
              {f === "write" && "Write"}
              {f === "none" && "Denied"}
            </button>
          ))}
        </div>

        {/* Resource List */}
        <div className="flex-1 overflow-y-auto px-12 py-8">
          <div className="max-w-2xl space-y-12">
            {/* Accessible */}
            {allowed.length > 0 && (
              <section className="space-y-4">
                <span className="label-system">Accessible</span>
                <div className="space-y-1">
                  {allowed.map((resource) => (
                    <button
                      key={resource.id}
                      onClick={() => setSelected(resource)}
                      className={cn(
                        "w-full text-left py-3 px-4 -mx-4 transition-colors group",
                        selected?.id === resource.id 
                          ? "bg-secondary" 
                          : "hover:bg-secondary/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className={cn(
                            "font-mono text-xs uppercase",
                            resource.permission === "read" && "status-allowed",
                            resource.permission === "write" && "text-foreground"
                          )}>
                            {resource.permission}
                          </span>
                          <span className="font-mono text-sm text-foreground">
                            {resource.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {resource.type}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Restricted */}
            {denied.length > 0 && (
              <section className="space-y-4">
                <span className="label-system">Restricted</span>
                <div className="space-y-1">
                  {denied.map((resource) => (
                    <button
                      key={resource.id}
                      onClick={() => setSelected(resource)}
                      className={cn(
                        "w-full text-left py-3 px-4 -mx-4 transition-colors opacity-50 hover:opacity-70",
                        selected?.id === resource.id && "bg-secondary opacity-70"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs uppercase status-denied">
                            denied
                          </span>
                          <span className="font-mono text-sm text-muted-foreground">
                            {resource.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {resource.type}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <aside className={cn(
        "w-80 border-l border-border bg-card/30 flex flex-col transition-opacity",
        selected ? "opacity-100" : "opacity-50"
      )}>
        <div className="p-6 border-b border-border">
          <span className="label-system">Resource Detail</span>
        </div>

        {selected ? (
          <div className="flex-1 p-6 space-y-8 overflow-y-auto">
            <div className="space-y-2">
              <span className="label-system">Identifier</span>
              <p className="font-mono text-sm text-foreground break-all">
                {selected.name}
              </p>
            </div>

            <div className="space-y-2">
              <span className="label-system">Status</span>
              <p className={cn(
                "font-mono text-sm",
                selected.permission === "none" ? "status-denied" : "status-allowed"
              )}>
                {selected.permission === "none" ? "Access Denied" : `${selected.permission.toUpperCase()} Access`}
              </p>
            </div>

            <div className="space-y-2">
              <span className="label-system">Environment</span>
              <p className="font-mono text-sm text-foreground">
                {selected.environment}
              </p>
            </div>

            <div className="space-y-2">
              <span className="label-system">Reasoning</span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selected.reason}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 flex items-center justify-center">
            <p className="text-xs text-muted-foreground/60 text-center">
              Select a resource<br />to view details
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
