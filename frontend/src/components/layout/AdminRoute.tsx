import { useAuth } from "@/contexts/AuthContext";
import Forbidden from "@/pages/Forbidden";
import { SystemLayout } from "./SystemLayout";
import { ReactNode } from "react";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Forbidden />;
  }

  return <SystemLayout>{children}</SystemLayout>;
}
