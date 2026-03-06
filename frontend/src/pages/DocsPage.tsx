import { useState } from "react";
import { cn } from "@/lib/utils";

interface DocEntry {
  id: string;
  title: string;
  classification: "open" | "internal" | "restricted";
  content: string;
}

const DOCS: DocEntry[] = [
  {
    id: "1",
    title: "Sandbox Environment",
    classification: "open",
    content: `Your sandbox is an isolated execution context. All resources are separated from production systems.

Time-limited access ensures credentials cannot persist beyond session scope. When your session expires, all tokens are invalidated automatically.

Permitted actions:
→ Query anonymized views
→ Access staging APIs (read-only by default)
→ Write to sandbox storage buckets
→ Validate against staging auth service

Restricted actions:
→ Direct production database access
→ Raw PII data retrieval
→ Production API mutations
→ Cross-environment data transfer`
  },
  {
    id: "2",
    title: "Permission Evaluation",
    classification: "internal",
    content: `The boundary system evaluates every resource request against your active policy set.

Evaluation order:
1. Collect all applicable policies
2. Evaluate explicit DENY rules first
3. Check for matching ALLOW rules
4. Default to DENY if no match

Policy identifiers follow namespace convention:
  domain.scope.specificity

Example policies:
  pii.protection.level_2
  env.isolation.strict
  api.staging.read

When access is denied, the system provides:
→ Reason for denial
→ Policy that triggered denial
→ Permitted alternatives when available`
  },
  {
    id: "3",
    title: "Anonymized Data Access",
    classification: "internal",
    content: `Anonymized views provide access to datasets with PII fields removed or obfuscated.

Available views:
  customers_anonymized_view
    Contains: customer_id, segment, region, signup_date
    Removed: email, phone, full_name, address

  customer_aggregate_metrics
    Contains: aggregated statistics by segment
    No individual records exposed

All anonymized views are read-only. Write operations are not permitted even with elevated scope.

Query example:
  SELECT segment, COUNT(*) 
  FROM customers_anonymized_view 
  GROUP BY segment`
  },
  {
    id: "4",
    title: "Policy Architecture",
    classification: "restricted",
    content: `Policies are defined as JSON documents with the following structure:

{
  "id": "namespace.scope.name",
  "effect": "ALLOW" | "DENY",
  "resources": ["resource:pattern:*"],
  "actions": ["READ", "WRITE", "DELETE"],
  "conditions": {
    "environment": ["sandbox", "staging"],
    "time_window": "session"
  }
}

Policies are evaluated server-side. Client cannot bypass evaluation.

Policy precedence:
1. Explicit DENY always wins
2. Most specific match takes precedence
3. Environment conditions are mandatory
4. Time-based conditions auto-expire`
  }
];

export default function DocsPage() {
  const [selected, setSelected] = useState<DocEntry>(DOCS[0]);

  return (
    <div className="h-screen flex flex-col">
      <header className="px-12 py-8 border-b border-border">
        <div className="flex items-baseline gap-4">
          <h1 className="display-system text-foreground">Knowledge Base</h1>
          <span className="label-system">Scoped Documentation</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Document List */}
        <div className="w-64 border-r border-border py-6">
          <div className="px-6 mb-4">
            <span className="label-system">Available Documents</span>
          </div>
          <div className="space-y-1">
            {DOCS.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelected(doc)}
                className={cn(
                  "w-full text-left px-6 py-3 transition-colors",
                  selected.id === doc.id 
                    ? "bg-secondary text-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <span className="text-sm">{doc.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto px-12 py-8">
          <div className="max-w-2xl space-y-6">
            <div className="space-y-2">
              <span className={cn(
                "text-[10px] uppercase tracking-wider",
                selected.classification === "open" && "text-muted-foreground",
                selected.classification === "internal" && "status-warning",
                selected.classification === "restricted" && "status-denied"
              )}>
                {selected.classification}
              </span>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                {selected.title}
              </h2>
            </div>

            <div className="space-y-4">
              {selected.content.split('\n\n').map((paragraph, i) => (
                <p 
                  key={i} 
                  className={cn(
                    "text-sm leading-relaxed",
                    paragraph.startsWith('  ') || paragraph.startsWith('→') 
                      ? "font-mono text-muted-foreground whitespace-pre-wrap"
                      : "text-foreground/80"
                  )}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Access Reason */}
        <div className="w-56 border-l border-border py-6 px-6">
          <span className="label-system">Access Reason</span>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            This document is within your sandbox policy scope.
          </p>
          <div className="mt-6 pt-6 border-t border-border space-y-3">
            <div>
              <span className="label-system">Classification</span>
              <p className="mt-1 text-xs text-foreground">{selected.classification}</p>
            </div>
            <div>
              <span className="label-system">Policy</span>
              <p className="mt-1 text-xs font-mono text-muted-foreground">
                docs.scope.{selected.classification}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}