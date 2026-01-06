import { ReactNode } from "react";
import React from "react";
import { SystemNav } from "./SystemNav";

interface SystemLayoutProps {
  children: ReactNode;
}

export function SystemLayout({ children }: SystemLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <SystemNav />
      <main className="ml-48 min-h-screen">
        {children}
      </main>
    </div>
  );
}