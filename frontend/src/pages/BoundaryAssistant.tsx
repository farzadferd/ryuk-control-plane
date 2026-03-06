import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SystemMessage {
  id: string;
  type: "system" | "user" | "response";
  content: string;
  decision?: "ALLOW" | "DENY" | "INFO";
  policies?: string[];
  alternatives?: string[];
  timestamp: string;
}

const INITIAL_MESSAGES: SystemMessage[] = [
  {
    id: "init",
    type: "system",
    content: "Boundary system initialized. Query permissions, access scope, or request guidance.",
    timestamp: new Date().toISOString()
  }
];

// Simulated responses
const getSystemResponse = (query: string): Omit<SystemMessage, 'id' | 'timestamp'> => {
  const q = query.toLowerCase();
  
  if (q.includes("customer") || q.includes("customers")) {
    return {
      type: "response",
      decision: "ALLOW",
      content: "Read access granted to customers_anonymized_view. Direct table access restricted. PII fields redacted: email, phone, address.",
      policies: ["pii.protection.level_2", "sandbox.view_only"],
      alternatives: ["customers_anonymized_view", "customer_aggregate_metrics"]
    };
  }
  
  if (q.includes("s3") || q.includes("bucket") || q.includes("production")) {
    return {
      type: "response",
      decision: "DENY",
      content: "Production storage access denied. Sandbox isolation enforced. Requested resource exists outside permitted boundary.",
      policies: ["env.isolation.strict", "storage.prod.deny_all"],
      alternatives: ["sandbox-uploads", "dev-fixtures"]
    };
  }
  
  if (q.includes("payment") || q.includes("staging")) {
    return {
      type: "response",
      decision: "ALLOW",
      content: "Staging payments endpoint accessible. Use sandbox credentials only. Endpoint: api.staging.internal/v2/payments",
      policies: ["api.staging.read", "credentials.sandbox_only"]
    };
  }
  
  return {
    type: "response",
    decision: "INFO",
    content: "Specify the resource or action you're querying. I can evaluate access permissions and suggest alternatives if restricted."
  };
};

export default function BoundaryAssistant() {
  const [messages, setMessages] = useState<SystemMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState<{
    policies?: string[];
    alternatives?: string[];
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: SystemMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      const response = getSystemResponse(userMessage.content);
      const responseMessage: SystemMessage = {
        id: (Date.now() + 1).toString(),
        ...response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, responseMessage]);
      setCurrentPolicy({
        policies: response.policies,
        alternatives: response.alternatives
      });
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="h-screen flex">
      {/* Main Query Area - Dominant */}
      <div className="flex-1 flex flex-col">
        {/* System Header */}
        <header className="px-12 py-8 border-b border-border">
          <div className="flex items-baseline gap-4">
            <h1 className="display-system text-foreground">Query Boundary</h1>
            <span className="label-system">Permission Evaluation System</span>
          </div>
        </header>

        {/* Message Stream - Not chat bubbles, system log style */}
        <div className="flex-1 overflow-y-auto px-12 py-8">
          <div className="max-w-2xl space-y-8">
            {messages.map((message, index) => (
              <div 
                key={message.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {message.type === "system" && (
                  <div className="space-y-1">
                    <span className="label-system">System</span>
                    <p className="system-text text-muted-foreground">{message.content}</p>
                  </div>
                )}

                {message.type === "user" && (
                  <div className="space-y-1">
                    <span className="label-system">Query</span>
                    <p className="text-lg text-foreground font-medium">{message.content}</p>
                  </div>
                )}

                {message.type === "response" && (
                  <div className="space-y-4">
                    {/* Decision */}
                    {message.decision && (
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "font-mono text-sm tracking-wider",
                          message.decision === "ALLOW" && "status-allowed",
                          message.decision === "DENY" && "status-denied",
                          message.decision === "INFO" && "text-muted-foreground"
                        )}>
                          {message.decision === "ALLOW" && "▹ ACCESS GRANTED"}
                          {message.decision === "DENY" && "▹ ACCESS DENIED"}
                          {message.decision === "INFO" && "▹ INFORMATION"}
                        </span>
                      </div>
                    )}

                    {/* Response Content */}
                    <p className="system-text text-foreground leading-relaxed max-w-xl">
                      {message.content}
                    </p>

                    {/* Alternatives */}
                    {message.alternatives && message.alternatives.length > 0 && (
                      <div className="pt-2">
                        <span className="label-system">Permitted Alternatives</span>
                        <div className="mt-2 flex flex-wrap gap-3">
                          {message.alternatives.map((alt, i) => (
                            <span 
                              key={i}
                              className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                              → {alt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="space-y-1 animate-fade-in">
                <span className="label-system">Processing</span>
                <p className="system-text text-muted-foreground cursor-blink">
                  Evaluating permissions
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Input - Minimal, powerful */}
        <div className="px-12 py-8 border-t border-border">
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
                ▹
              </span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What resource or action do you want to evaluate?"
                disabled={isProcessing}
                className="w-full bg-transparent border-none outline-none pl-6 py-2 text-foreground placeholder:text-muted-foreground/50 font-mono text-sm focus-glow"
              />
            </div>
            <div className="mt-4 flex items-center gap-6 text-[10px] text-muted-foreground/60">
              <span>ENTER to submit</span>
              <span className="h-3 w-px bg-border" />
              <span>Try: "Can I access the customers table?"</span>
            </div>
          </form>
        </div>
      </div>

      {/* Policy Panel - Tucked away, secondary */}
      <aside className="w-72 border-l border-border bg-card/30 flex flex-col">
        <div className="p-6 border-b border-border">
          <span className="label-system">Policy Context</span>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-8">
          {/* Applied Policies */}
          {currentPolicy.policies && currentPolicy.policies.length > 0 ? (
            <div className="space-y-3">
              <span className="label-system">Applied Rules</span>
              <div className="space-y-2">
                {currentPolicy.policies.map((policy, i) => (
                  <div 
                    key={i}
                    className="font-mono text-xs text-muted-foreground"
                  >
                    {policy}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="label-system">Awaiting Query</span>
              <p className="text-xs text-muted-foreground/60">
                Policy context will appear after evaluation
              </p>
            </div>
          )}

          {/* Session Info */}
          <div className="space-y-3">
            <span className="label-system">Session</span>
            <div className="space-y-2 font-mono text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Environment</span>
                <span className="text-foreground">sandbox</span>
              </div>
              <div className="flex justify-between">
                <span>Isolation</span>
                <span className="text-foreground">strict</span>
              </div>
              <div className="flex justify-between">
                <span>Token</span>
                <span className="text-foreground">tk_•••7f2a</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}