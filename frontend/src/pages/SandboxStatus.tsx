import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Sandbox expires in 2 days 14 hours
const EXPIRY = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000);

function calculateTime(expiry: Date): TimeRemaining {
  const diff = expiry.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  };
}

const RECENT_EVENTS = [
  { action: "SELECT customers_anonymized_view", result: "allow", time: "2m" },
  { action: "WRITE sandbox-uploads/test.csv", result: "allow", time: "5m" },
  { action: "SELECT customers", result: "deny", time: "12m" },
  { action: "GET api.staging/payments", result: "allow", time: "18m" },
  { action: "PUT production-backups", result: "deny", time: "25m" },
];

const CREDENTIALS = [
  { name: "API Token", status: "active", expires: "62h" },
  { name: "Database Token", status: "active", expires: "62h" },
  { name: "Storage Token", status: "warning", expires: "4h" },
];

export default function SandboxStatus() {
  const [time, setTime] = useState(() => calculateTime(EXPIRY));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTime(EXPIRY));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <header className="px-12 py-8 border-b border-border">
        <div className="flex items-baseline gap-4">
          <h1 className="display-system text-foreground">Session Status</h1>
          <span className="label-system">Sandbox Lifecycle</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="px-12 py-12 space-y-16 max-w-4xl">
          {/* Countdown - Dominant Element */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-[hsl(120_40%_45%)] animate-pulse" />
              <span className="label-system">Time Remaining</span>
            </div>

            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-7xl font-semibold text-foreground tracking-tighter">
                {String(time.days).padStart(2, '0')}
              </span>
              <span className="text-2xl text-muted-foreground mr-4">d</span>
              
              <span className="text-7xl font-semibold text-foreground tracking-tighter">
                {String(time.hours).padStart(2, '0')}
              </span>
              <span className="text-2xl text-muted-foreground mr-4">h</span>
              
              <span className="text-7xl font-semibold text-foreground tracking-tighter">
                {String(time.minutes).padStart(2, '0')}
              </span>
              <span className="text-2xl text-muted-foreground mr-4">m</span>
              
              <span className="text-5xl font-semibold text-muted-foreground tracking-tighter">
                {String(time.seconds).padStart(2, '0')}
              </span>
              <span className="text-xl text-muted-foreground">s</span>
            </div>

            <p className="text-sm text-muted-foreground">
              Session will terminate automatically. All tokens will be invalidated.
            </p>
          </section>

          {/* Credentials */}
          <section className="space-y-4">
            <span className="label-system">Active Credentials</span>
            <div className="space-y-2">
              {CREDENTIALS.map((cred, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      cred.status === "active" && "bg-[hsl(120_40%_45%)]",
                      cred.status === "warning" && "bg-[hsl(45_50%_50%)] animate-pulse"
                    )} />
                    <span className="text-sm text-foreground">{cred.name}</span>
                  </div>
                  <span className={cn(
                    "font-mono text-xs",
                    cred.status === "warning" ? "status-warning" : "text-muted-foreground"
                  )}>
                    {cred.expires}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="space-y-4">
            <span className="label-system">Recent Activity</span>
            <div className="space-y-1">
              {RECENT_EVENTS.map((event, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-6 py-2 text-sm"
                >
                  <span className={cn(
                    "font-mono text-xs w-12",
                    event.result === "allow" ? "status-allowed" : "status-denied"
                  )}>
                    {event.result.toUpperCase()}
                  </span>
                  <span className="flex-1 font-mono text-muted-foreground truncate">
                    {event.action}
                  </span>
                  <span className="text-xs text-muted-foreground/60">
                    {event.time} ago
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Active Policies */}
          <section className="space-y-4">
            <span className="label-system">Active Policy Set</span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                "pii.protection.level_2",
                "env.isolation.strict",
                "storage.sandbox_only",
                "api.staging.read",
                "production.deny_all"
              ].map((policy, i) => (
                <span key={i} className="font-mono text-xs text-muted-foreground">
                  {policy}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}