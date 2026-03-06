import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth, UserRole } from "@/contexts/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("sandbox_user");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (!email || !password) {
        setError("Authentication failed.");
        setIsLoading(false);
      } else {
        login(email, role);
        navigate("/dashboard");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-2xl font-mono font-medium tracking-tight text-foreground mb-2">
              RYUK
            </h1>
            <p className="text-sm font-mono text-muted-foreground tracking-wide">
              Temporal Sandboxing OS
            </p>
          </div>

          {/* System Notice */}
          <div className="mb-12 text-center">
            <p className="text-xs font-mono text-muted-foreground/70 tracking-wide">
              Access to this environment is restricted and time-scoped.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthenticate} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-2 tracking-wide">
                  EMAIL
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-border/50 rounded-none font-mono text-sm h-12 focus:border-foreground focus:ring-0 transition-colors"
                  placeholder="identifier@domain"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-2 tracking-wide">
                  PASSWORD
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-border/50 rounded-none font-mono text-sm h-12 focus:border-foreground focus:ring-0 transition-colors"
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                />
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-2 tracking-wide">
                  ROLE
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("sandbox_user")}
                    className={`flex-1 h-12 border font-mono text-sm tracking-wide transition-colors ${
                      role === "sandbox_user"
                        ? "border-foreground text-foreground bg-foreground/5"
                        : "border-border/50 text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    SANDBOX_USER
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`flex-1 h-12 border font-mono text-sm tracking-wide transition-colors ${
                      role === "admin"
                        ? "border-foreground text-foreground bg-foreground/5"
                        : "border-border/50 text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    ADMIN
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="py-3 border-l-2 border-destructive pl-4">
                <p className="text-xs font-mono text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-none bg-foreground text-background hover:bg-foreground/90 font-mono text-sm tracking-wider transition-all disabled:opacity-50"
            >
              {isLoading ? "AUTHENTICATING..." : "AUTHENTICATE"}
            </Button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-3">
            <button className="text-xs font-mono text-muted-foreground/60 hover:text-muted-foreground transition-colors tracking-wide">
              Accept invite
            </button>
            <button className="text-xs font-mono text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors">
              Having trouble? Contact your administrator
            </button>
          </div>
        </div>
      </div>

      <footer className="py-8 px-6">
        <div className="max-w-md mx-auto">
          <div className="border-t border-border/30 pt-6 space-y-2">
            <p className="text-[10px] font-mono text-muted-foreground/40 tracking-wide text-center">
              Access is scoped to an assigned sandbox.
            </p>
            <p className="text-[10px] font-mono text-muted-foreground/40 tracking-wide text-center">
              Sessions may expire automatically.
            </p>
            <p className="text-[10px] font-mono text-muted-foreground/40 tracking-wide text-center">
              All activity is monitored and audited.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
