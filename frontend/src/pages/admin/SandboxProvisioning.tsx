import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  duration: string;
  policies: number;
  active: number;
}

interface Instance {
  id: string;
  user: string;
  template: string;
  status: "active" | "expiring";
  remaining: string;
}

const TEMPLATES: Template[] = [
  { id: "1", name: "Developer Standard", duration: "7d", policies: 5, active: 12 },
  { id: "2", name: "QA Extended", duration: "14d", policies: 8, active: 4 },
  { id: "3", name: "Security Audit", duration: "3d", policies: 3, active: 2 },
];

const INSTANCES: Instance[] = [
  { id: "DEV-7291", user: "alice@company.com", template: "Developer Standard", status: "active", remaining: "6d 12h" },
  { id: "DEV-7288", user: "bob@company.com", template: "Developer Standard", status: "active", remaining: "5d 8h" },
  { id: "QA-1044", user: "carol@company.com", template: "QA Extended", status: "expiring", remaining: "2h 30m" },
  { id: "SEC-0091", user: "dave@company.com", template: "Security Audit", status: "active", remaining: "2d 4h" },
];

export default function SandboxProvisioning() {
  return (
    <div className="h-screen flex flex-col">
      <header className="px-12 py-8 border-b border-border">
        <div className="flex items-baseline gap-4">
          <h1 className="display-system text-foreground">Provisioning</h1>
          <span className="label-system">Sandbox Management</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-12 py-8">
        <div className="max-w-4xl space-y-16">
          {/* Templates */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="label-system">Templates</span>
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                + Create Template
              </button>
            </div>

            <div className="space-y-2">
              {TEMPLATES.map((template) => (
                <div 
                  key={template.id}
                  className="flex items-center justify-between py-4 border-b border-border last:border-0 group"
                >
                  <div className="space-y-1">
                    <span className="text-foreground">{template.name}</span>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                      <span>{template.duration}</span>
                      <span>{template.policies} policies</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs text-muted-foreground">
                      {template.active} active
                    </span>
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                      Deploy →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Active Instances */}
          <section className="space-y-6">
            <span className="label-system">Active Instances</span>

            <div className="space-y-px">
              {/* Header */}
              <div className="grid grid-cols-5 gap-4 py-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                <span>ID</span>
                <span>User</span>
                <span>Template</span>
                <span>Status</span>
                <span className="text-right">Remaining</span>
              </div>

              {/* Rows */}
              {INSTANCES.map((instance) => (
                <div 
                  key={instance.id}
                  className="grid grid-cols-5 gap-4 py-3 border-t border-border text-sm group hover:bg-secondary/30 -mx-4 px-4"
                >
                  <span className="font-mono text-muted-foreground">{instance.id}</span>
                  <span className="text-foreground truncate">{instance.user}</span>
                  <span className="text-muted-foreground">{instance.template}</span>
                  <span className={cn(
                    instance.status === "expiring" ? "status-warning" : "status-allowed"
                  )}>
                    {instance.status}
                  </span>
                  <span className="font-mono text-right text-muted-foreground">
                    {instance.remaining}
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