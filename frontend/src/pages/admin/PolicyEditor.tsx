import { useState } from "react";
import { cn } from "../../lib/utils";
import React from "react";

const POLICY_JSON = `{
  "version": "2.1",
  "policies": [
    {
      "id": "pii.protection.level_2",
      "effect": "DENY",
      "resources": [
        "database:customers",
        "database:users",
        "database:payments"
      ],
      "actions": ["*"],
      "conditions": {
        "environment": ["sandbox"]
      }
    },
    {
      "id": "env.isolation.strict",
      "effect": "DENY", 
      "resources": ["*:production-*"],
      "actions": ["*"]
    },
    {
      "id": "api.staging.read",
      "effect": "ALLOW",
      "resources": ["api:staging.*"],
      "actions": ["GET"],
      "conditions": {
        "environment": ["sandbox", "staging"]
      }
    }
  ]
}`;

const VERSIONS = [
  { version: "v2.1", date: "2h ago", author: "admin", note: "Added storage policies" },
  { version: "v2.0", date: "1d ago", author: "admin", note: "Updated PII protection" },
  { version: "v1.9", date: "3d ago", author: "security", note: "Security review" },
  { version: "v1.8", date: "1w ago", author: "admin", note: "Initial structure" },
];

export default function PolicyEditor() {
  const [content, setContent] = useState(POLICY_JSON);
  const [selectedVersion, setSelectedVersion] = useState("v2.1");

  return (
    <div className="h-screen flex flex-col">
      <header className="px-12 py-8 border-b border-border">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-4">
            <h1 className="display-system text-foreground">Policy Editor</h1>
            <span className="label-system">JSON Configuration</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Simulate
            </button>
            <button className="text-xs text-foreground">
              Save
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className="px-6 py-3 border-b border-border flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">policy.json</span>
            <span className="font-mono text-[10px] text-muted-foreground">{selectedVersion}</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full bg-transparent font-mono text-sm text-foreground/90 p-6 resize-none focus:outline-none leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Version History */}
        <div className="w-64 border-l border-border py-6">
          <div className="px-6 mb-4">
            <span className="label-system">Version History</span>
          </div>
          <div className="space-y-1">
            {VERSIONS.map((v) => (
              <button
                key={v.version}
                onClick={() => setSelectedVersion(v.version)}
                className={cn(
                  "w-full text-left px-6 py-3 transition-colors",
                  selectedVersion === v.version 
                    ? "bg-secondary" 
                    : "hover:bg-secondary/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "font-mono text-xs",
                    selectedVersion === v.version ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {v.version}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">{v.date}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {v.note}
                </p>
              </button>
            ))}
          </div>

          <div className="px-6 mt-6">
            <button 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              disabled={selectedVersion === "v2.1"}
            >
              Restore {selectedVersion}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}