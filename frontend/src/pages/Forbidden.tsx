import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Error Code */}
        <div>
          <span className="font-mono text-6xl font-bold text-foreground tracking-tighter">403</span>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-lg font-mono font-medium tracking-tight text-foreground">
            Not Authorized
          </h1>
          <p className="text-sm font-mono text-muted-foreground leading-relaxed">
            Your current role does not have permission to access this resource.
            Administrative pages require elevated privileges.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/50 w-24 mx-auto" />

        {/* Metadata */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
              Classification
            </span>
            <span className="text-xs font-mono text-destructive">RESTRICTED</span>
          </div>
          <p className="text-[10px] font-mono text-muted-foreground/40">
            This access attempt has been logged for audit purposes.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 pt-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm font-mono text-foreground hover:text-foreground/70 transition-colors tracking-wide"
          >
            ← Return to Dashboard
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-[10px] font-mono text-muted-foreground/50 hover:text-muted-foreground transition-colors uppercase tracking-widest"
          >
            Terminate Session
          </button>
        </div>
      </div>
    </div>
  );
}